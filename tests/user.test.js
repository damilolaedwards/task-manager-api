const request = require('supertest')
const app = require('../src/app')
const fetch = require('./fixtures/fetch')
const User = require('../src/models/user')
const {testUserId, testUser, setUpDatabase } = require('./fixtures/db')

jest.setTimeout(120000)


beforeEach(setUpDatabase)



test('should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name : 'Damilola Edwards',
        email : 'damilolaedwards@gmail.com',
        password : '123456789'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user : {
            name : user.name,
            email : user.email,
        },
        token :user.tokens[0].token
    })
    expect(user.password).not.toBe('123456789')

})

test('password length less than 8 chars, sign up should fail', async () => {
    await request(app).post('/users').send({
        name : 'Damilola Edwards',
        email : 'damilolaedwards@gmail.com',
        password : '1234'
    }).expect(400)
})

test('password length contains "password" signup should fail', async() => {
    await request(app).post('/users').send({
        name : 'Damilola Edwards',
        email : 'damilolaedwards@gmail.com',
        password : '1234password'
    }).expect(400)
})

test('should login new user', async () => {
   const response = await request(app).post('/users/login').send({
        email : testUser.email,
        password : testUser.password
    }).expect(200)
    const user = await User.findById(testUserId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('non-existent login parameters, login should fail', async () => {
    await request(app).post('/users/login').send({
        email : 'hello@gmail.com',
        password : 'hello@123'
    }).expect(500)
})

test('should get profile of user', async () => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send().expect(200)
})

test('should delete an account of authenticated user', async () => {
    await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send().expect(200)
    const user = await User.findById(testUserId)
    expect(user).toBeNull()
})

test('unauthenticated user, account delete should fail', async () => {
    await request(app).delete('/users/me').send().expect(401)
})


test('should update valid fields', async () => {
    const response = await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
        name : 'aminu ali',
        age : 21,
    }).expect(200)

    const user = await User.findById(testUserId)
    expect(user.name).toBe(response.body.name)
    expect(user.age).toBe(response.body.age)
})

test('should not update invalid fields', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
        email : 'aminuali@gmail.com',
    }).expect(400)
})



test('should upload avatar', async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile_pic.jpeg')
    .expect(201)

    const user = await User.findById(testUserId)
    expect(user.avatar).not.toBeNull()

    expect(user.cloudinary_id).not.toBeNull()
    const res = await fetch.getAvatar(user)
    expect(res).toBe(200)
    
})

