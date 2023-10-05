const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()



crate = async () =>{
    const user = await prisma.uasdsad.create({
        data: {
          email: 'els2@prisma.io',
          name: 'Elsa2 Prisma',
        },
      })
    
      console.log(user);
}

read = async () => {
    const data = await prisma.users.findMany()

    console.log(data);
}

rawRead = async () => {
    const result = await prisma.$queryRaw`SELECT * FROM Users`
    console.log(result);
}

crate()
// read()
// rawRead()
