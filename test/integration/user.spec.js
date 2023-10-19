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
var userid 
var userid2

describe("test POST /users endpoint ", () => {

    test("berhasil", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/users").send({
            email : email,
            password : password,
            name : name,
            identity_type : identity_type,
            identity_number : identity_number,
            address : address
        })

        userid = body.data.newUser.id

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("newUser");
        expect(body.data).toHaveProperty("profile");
        expect(body.data.newUser).toHaveProperty("id");
        expect(body.data.newUser).toHaveProperty("name");
        expect(body.data.newUser).toHaveProperty("email");
        expect(body.data.profile).toHaveProperty("id");
        expect(body.data.profile).toHaveProperty("identity_type");
        expect(body.data.profile).toHaveProperty("identity_number");
        expect(body.data.profile).toHaveProperty("address");
        expect(body.data.profile).toHaveProperty("user_id");
        expect(body.data.newUser.name).toBe(name);
        expect(body.data.newUser.email).toBe(email);
        expect(body.data.profile.identity_type).toBe(identity_type);
        expect(body.data.profile.identity_number).toBe(identity_number);
        expect(body.data.profile.address).toBe(address);


    })
    test("error -> email sudah terdaftar", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/users").send({
            email : email,
            name : name,
            password : password,
            identity_type : identity_type,
            identity_number : identity_number,
            address : address
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("email used by other user!")


    })
    test("error -> identity number sudah terdaftar", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/users").send({
            email : email+"99",
            name : name,
            password : password,
            identity_type : identity_type,
            identity_number : identity_number,
            address : address
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("identity Number used by other user!")


    })
    // test("name / email / identity_type / identity_number / address kosong")
    test("error -> name / email / identity_type / identity_number / address kosong", async () => {
        const  { statusCode, body } = await request(app).post("/api/v1/users").send({
            email : email,
            name : name,
            password : password,
            identity_type : "",
            address : address
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("Name, password, email, identity type, identity number and address are required fields")


    })
})


describe("test GET /users endpoint ", () => { 

    test("berhasil membuat user baru", async () => {
        const {statusCode,body} = await request(app).get("/api/v1/users")

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBeInstanceOf(Array)
        expect(body.data[0]).toHaveProperty("id");
        expect(body.data[0]).toHaveProperty("name");
        expect(body.data[0]).toHaveProperty("email");
        expect(body.data[0]).toHaveProperty("password");
        expect(body.data[0]).toHaveProperty("profiles");
        expect(body.data[0].profiles).toHaveProperty("identity_type");
        expect(body.data[0].profiles).toHaveProperty("identity_number");
        expect(body.data[0].profiles).toHaveProperty("address");

    })

})

//// users/:id


describe("test GET /users/:id endpoint ", () => { 

    test("berhasil menampilkan data berdasarkan ID", async () => {
        const {statusCode,body} = await request(app).get(`/api/v1/users/${userid}`)

        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("name")
        expect(body.data).toHaveProperty("email")
        expect(body.data).toHaveProperty("password")
        expect(body.data.id).toBe(userid)
        expect(body.data.name).toBe(name)
        expect(body.data.email).toBe(email)
        expect(body.data.password).toBe(password)

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).get(`/api/v1/users/${userid}9999`)

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("Id not found")

    })

})



//put /users

describe("test PUT /users/:id endpoint ", () => { 

    test("berhasil meng update data user", async () => {
        const {statusCode,body} = await await request(app).put(`/api/v1/users/${userid}`).send({
            email : email+"updated",
            password : password+"updated",
            name : name+"updated",
        })

        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("name")
        expect(body.data).toHaveProperty("email")
        expect(body.data).toHaveProperty("password")
        expect(body.data.id).toBe(userid)
        expect(body.data.name).toBe(name+"updated")
        expect(body.data.email).toBe(email+"updated")
        expect(body.data.password).toBe( password+"updated")

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/users/${userid}9999`).send({
            email : email+"updated",
            password : password+"updated",
            name : name+"updated",
        })

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("Id not found")

    })

    test("error -> name / email / identity_type / identity_number / address kosong", async () => {
        const  { statusCode, body } = await request(app).put(`/api/v1/users/${userid}`).send({
            email : "",
            password : "",
            name : "",
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("Name, password and email are required fields")


    })

})


/// Delete /users



describe("test DELETE /users/:id endpoint ", () => { 

    test("berhasil menghapus data user", async () => {
        const {statusCode,body} = await await request(app).delete(`/api/v1/users/${userid}`)

        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("name")
        expect(body.data).toHaveProperty("email")
        expect(body.data).toHaveProperty("password")
        expect(body.status).toBe("success") 
        expect(body.message).toBe("user deleted ! ")       

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).delete(`/api/v1/users/${userid}9999`)

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data") 
        expect(body.data).toBe("Id not found")

    })


})


/// PUT /profiles


describe("test PUT /profiles/:id endpoint ", () => { 
    beforeAll(async () => {
          const newUser2 = await prisma.users.create({
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

        userid2 = newUser2.id
            
    });    


    

    test("berhasil meng update data profil", async () => {
        const {statusCode,body} = await await request(app).put(`/api/v1/profile/${userid2}`).send({
            identity_type : identity_type+"updated",
            identity_number : identity_number+"99",
            address : address+"updated"
        })

        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toHaveProperty("id")
        expect(body.data).toHaveProperty("identity_type")
        expect(body.data).toHaveProperty("identity_number")
        expect(body.data).toHaveProperty("address") 
        expect(body.data).toHaveProperty("user_id") 
        expect(body.data.user_id).toBe(userid2)
        expect(body.data.identity_type).toBe(identity_type+"updated")
        expect(body.data.identity_number).toBe(identity_number+"99")
        expect(body.data.address).toBe( address+"updated")

    })

    test("error -> Id tidak terdaftar", async () => {
        const {statusCode,body} = await request(app).put(`/api/v1/profile/${userid2}9999`).send({
            identity_type : identity_type+"updated",
            identity_number : identity_number+"99",
            address : address+"updated"
        })

        expect(statusCode).toBe(400)
        expect(body).toHaveProperty("status")
        expect(body).toHaveProperty("message")
        expect(body).toHaveProperty("data")
        expect(body.data).toBe("Id not found")

    })

    test("error -> identity_type / identity_number address kosong", async () => {
        const  { statusCode, body } = await request(app).put(`/api/v1/profile/${userid2}`).send({
            identity_type : "",
            identity_number : "",
            address : ""
        })

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.status).toBe("error")
        expect(body.message).toBe("bad request")
        expect(body.data).toBe("identity number, indentity type and addres are required fields")


    })

})







