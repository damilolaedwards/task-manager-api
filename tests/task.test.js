const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {testUserId, secondTestUserId, testUser, secondTestUser, setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase)

test('should create new task', async () => {
    const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
        'description' : 'Go to work'
    }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task.description).toBe('Go to work')
    expect(task.completed).toBe(false)
    expect(task.owner).toEqual(testUserId)
})

test('should get all tasks of a user', async () => {
    response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${secondTestUser.tokens[0].token}`)
    .send().expect(200)

    expect(response.body.length).toBe(2) 
})

test('should not delete task of another user', async () => {
    const task = await Task.findOne({
        owner : testUserId
    })
    await request(app).delete(`/tasks/${task._id}`)
    .set('Authorization', `Bearer ${secondTestUser.tokens[0].token}`)
    .expect(500)

    const check_task = await Task.find(task._id)

    expect(check_task).not.toBeNull()
})