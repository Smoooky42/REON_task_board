import { PrismaClient, EnumRoleUser } from '@prisma/client'
import { hash } from 'argon2';

const prisma = new PrismaClient()

async function main() {
    const oldUsers = await prisma.user.findFirst({
        where: {
            email: 'test@yandex.ru',
        },
    })
    if (oldUsers) return

    const testUser = await prisma.user.create({
        data: {
            email: 'test@yandex.ru',
            name: 'admin',
            password: await hash('admin'),
            role: EnumRoleUser.ADMIN,
        },
    })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })