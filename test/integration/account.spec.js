const {app} = require("../../server")
const request = require("supertest")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

var email = `testing${Date.now()}@gmail.com`;
var name = "testing"
var password = "password"
var identity_type = "driving license"
var identity_number = `${Date.now()}`
var address = "Jakarta"

var bankName = `bank ${Date.now()}`
var balance = 9999999
var userId 
var userIdNotValid = -1
var bankId 


describe("test POST /accounts endpoint ", () => {

    beforeAll(async () => {
        const newUser = await prisma.users.create({
          data : {
              email : email,
              name : name,
              password : password,
              profiles : {
                  create : {
                      identity_type : identity_type,
                      identity_number : identity_number,
                      address : address
                  }
              }
          } 
      })

      userId = newUser.id
          
  });    

    test("berhasil membuat bank account baru", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/accounts").send({
            bankName : bankName,
            balance : balance,
            userId : userId
        })

        bankId = body.data.id

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("id");
        expect(body.data).toHaveProperty("bank_name");
        expect(body.data).toHaveProperty("bank_account_number");
        expect(body.data).toHaveProperty("balance");
        expect(body.data).toHaveProperty("user_id");
        expect(body.data.bank_name).toBe(bankName)
        expect(body.data.balance).toBe(balance)
        expect(body.data.user_id).toBe(userId)


    })


    test("error -> userid tidak terdaftar", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/accounts").send({
            bankName : bankName,
            balance : balance,
            userId : userIdNotValid
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("Userid not exist")

    })
    
    test("error -> bank name / balance / userid kosong", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/accounts").send({
            bankName : "",
            balance : "",
            userId : ""
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("bank name, balance, and userid are required fields")
// 
// 
    })
})


/// get all account

describe("test GET /accounts endpoint ", () => {

    test("berhasil menampilkan semua account", async () => {
        const {statusCode,body} = await request(app).get("/api/v1/accounts")

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBeInstanceOf(Array)
        expect(body.data[0]).toHaveProperty("id");
        expect(body.data[0]).toHaveProperty("bank_name");
        expect(body.data[0]).toHaveProperty("bank_account_number");
        expect(body.data[0]).toHaveProperty("balance");
        expect(body.data[0]).toHaveProperty("user_id");

    })

})


describe("test GET /accounts/:id endpoint ", () => { 

    test("berhasil menampilkan data account berdasarkan ID", async () => {
        const {statusCode,body} = await request(app).get(`/api/v1/accounts/${bankId}`)

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("bank_name")
        expect(body.data).toHaveProperty("bank_account_number")
        expect(body.data).toHaveProperty("balance")    
        expect(body.data).toHaveProperty("user_id")    
        expect(body.data.user_id).toBe(userId)
        expect(body.data.bank_name).toBe(bankName)

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).get(`/api/v1/accounts/${bankId+9999}`)

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("no bank account found")

    })

})

///put account 


describe("test PUT /accounts/:id endpoint ", () => { 

    test("berhasil meng update data user", async () => {
        const {statusCode,body} =  await request(app).put(`/api/v1/accounts/${bankId}`).send({
            bankName : bankName+" updated"
        })

        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("bank_name")
        expect(body.data).toHaveProperty("bank_account_number")
        expect(body.data).toHaveProperty("balance")    
        expect(body.data).toHaveProperty("user_id")    
        expect(body.data.user_id).toBe(userId)
        expect(body.data.bank_name).toBe( bankName+" updated")

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/accounts/${bankId+9999}`).send({
            bankName : bankName+" updated"
        })

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("no bank account found")

    })

    test("error -> name / email / identity_type / identity_number / address kosong", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/accounts/${bankId}`).send({
            bankName : ""
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("bank name required fields")


    })

})

///delete accounts
describe("test DELETE /accounts/:id endpoint ", () => { 

    test("berhasil menghapus data account", async () => {
        const {statusCode,body} = await request(app).delete(`/api/v1/accounts/${bankId}`)

        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("bank_name")
        expect(body.data).toHaveProperty("bank_account_number")
        expect(body.data).toHaveProperty("balance")    
        expect(body.data).toHaveProperty("user_id")    
        expect(body.data.user_id).toBe(userId)
        expect(body.data.bank_name).toBe( bankName+" updated")
       

    })

    test("error -> bank id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).delete(`/api/v1/accounts/${bankId}`)

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("no bank account found")

    })


})
