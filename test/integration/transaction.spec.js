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

var bankName1 = `bank ${Date.now()}`
var bankName2 = `bank2 ${Date.now()}`
var balance = 10
var accountNumber1 = `1${Date.now()}`
var accountNumber2 = `2${Date.now()}`


var accountId1 
var accountId2 
var userId

var transactionId

describe("test POST /transactions endpoint ", () => {

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

        const newAccount1 = await prisma.bank_accounts.create({
            data : {
                bank_name : bankName1,
                balance : balance,
                user_id : userId,
                bank_account_number: accountNumber1
            }
        })
        accountId1 = newAccount1.id

        const newAccount2 = await prisma.bank_accounts.create({
            data : {
                bank_name : bankName2,
                balance : balance,
                user_id : userId,
                bank_account_number: accountNumber2
            }
        })
    
      accountId2 = newAccount2.id
          
  });    

    test("berhasil membuat transfer", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/transactions").send({
            sourceId : accountId1,
            destinatonId : accountId2,
            amount : 1
        })

        transactionId = body.data.transaction.id

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("sender");
        expect(body.data).toHaveProperty("receiver");
        expect(body.data).toHaveProperty("transaction");

        expect(body.data.sender).toHaveProperty("id")
        expect(body.data.sender).toHaveProperty("bank_name")
        expect(body.data.sender).toHaveProperty("bank_account_number")
        expect(body.data.sender).toHaveProperty("balance")
        expect(body.data.sender).toHaveProperty("user_id")

        expect(body.data.receiver).toHaveProperty("id")
        expect(body.data.receiver).toHaveProperty("bank_name")
        expect(body.data.receiver).toHaveProperty("bank_account_number")
        expect(body.data.receiver).toHaveProperty("balance")
        expect(body.data.receiver).toHaveProperty("user_id")

        expect(body.data.transaction).toHaveProperty("id")
        expect(body.data.transaction).toHaveProperty("amount")
        expect(body.data.transaction).toHaveProperty("source_account_id")
        expect(body.data.transaction).toHaveProperty("destination_account_id")


    })


    test("error -> source account tidak terdaftar", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/transactions").send({
            sourceId : 9999999,
            destinatonId : accountId2,
            amount : 1
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("Sender account not exist")
// 
    })

    test("error -> destination account tidak terdaftar", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/transactions").send({
            sourceId : accountId1,
            destinatonId : 9999999,
            amount : 1
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("Destination account not exist")
// 
    })

    test("error -> source ID balance lebih kecil dari jumlah transfer", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/transactions").send({
            sourceId : accountId1,
            destinatonId : accountId2,
            amount : 999
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("your balance is not enough")
// 
    })


    // 
    test("error ->balance / destination id kosong", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/transactions").send({
            sourceId : accountId1,
            destinatonId : accountId2,
            amount : ''
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("transfer amount are required fields")


    })
})



// get transactions

describe("test GET /transactions endpoint ", () => {

    test("berhasil menampilkan semua transaksi", async () => {
        const {statusCode,body} = await request(app).get("/api/v1/transactions")

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBeInstanceOf(Array)
        expect(body.data[0]).toHaveProperty("id");
        expect(body.data[0]).toHaveProperty("amount");
        expect(body.data[0]).toHaveProperty("source_account_id");
        expect(body.data[0]).toHaveProperty("destination_account_id");

    })

})


describe("test GET /transactions/:id endpoint ", () => { 

    test("berhasil menampilkan data transaksi berdasarkan ID", async () => {    
        const {statusCode,body} = await request(app).get(`/api/v1/transactions/${transactionId}`)

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("amount")
        expect(body.data).toHaveProperty("source_account_id")
        expect(body.data).toHaveProperty("destination_account_id")    
        expect(body.data).toHaveProperty("source_account_name")    
        expect(body.data).toHaveProperty("destination_account_name")    

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).get(`/api/v1/transactions/${transactionId+9999}`)

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("Transaction id not found")

    })

})

describe("test PUT /withdraw endpoint ", () => { 

    test("berhasil menampilkan data withdraw", async () => {    
        const {statusCode,body} = await request(app).put(`/api/v1/withdraw`).send({
            bankId : accountId1,
            amount : "1"
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

    })

    test("error -> account Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/withdraw`).send({
            bankId : 9999999,
            amount : "1"
        })


        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("account not found")

    })

    test("error -> amount lebih besar dari balance", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/withdraw`).send({
            bankId : accountId1,
            amount : 9999
        })


        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("not enough balance")

    })


})






describe("test PUT /deposit endpoint ", () => { 

    test("berhasil menampilkan data deposit", async () => {    
        const {statusCode,body} = await request(app).put(`/api/v1/deposit`).send({
            bankId : accountId1,
            amount : "1"
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

    })

    test("error -> account Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/deposit`).send({
            bankId : accountId1+999999,
            amount : "1"
        })

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("account not found")

    })

})





