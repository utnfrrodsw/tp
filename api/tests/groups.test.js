const request = require('supertest')
const express = require('express')
const { Group, Technician, Task } = require('../sequelize')
const { getPagination, getPaginationData } = require('../helpers/pagination')
const groupsController = require('../controllers/groups')

const app = express()
app.use(express.json())
app.get('/groups', groupsController.getGroups)
app.get('/groups/:id', groupsController.getGroup)
app.post('/groups', groupsController.createGroup)
app.put('/groups/:id', groupsController.updateGroup)
app.delete('/groups/:id', groupsController.deleteGroup)

jest.mock('../sequelize')
jest.mock('../helpers/pagination')

describe('Groups Controller', () => {
    describe('getGroups', () => {
        it('should return paginated groups', async () => {
            const mockGroups = { count: 2, rows: [{ id: 1, description: 'Group 1' }, { id: 2, description: 'Group 2' }] }
            Group.findAndCountAll.mockResolvedValue(mockGroups)
            getPagination.mockReturnValue({ limit: 10, offset: 0 })
            getPaginationData.mockReturnValue({ totalItems: 2, groups: mockGroups.rows, totalPages: 1, currentPage: 1 })

            const res = await request(app).get('/groups?page=1&size=10')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({ totalItems: 2, groups: mockGroups.rows, totalPages: 1, currentPage: 1 })
        })

        it('should handle errors', async () => {
            Group.findAndCountAll.mockRejectedValue(new Error('Some error'))

            const res = await request(app).get('/groups?page=1&size=10')

            expect(res.status).toBe(500)
            expect(res.body).toEqual({ message: 'Some error occurred while retrieving groups.' })
        })
    })

    describe('getGroup', () => {
        it('should return a group by id', async () => {
            const mockGroup = { id: 1, description: 'Group 1' }
            Group.findByPk.mockResolvedValue(mockGroup)

            const res = await request(app).get('/groups/1')

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockGroup)
        })

        it('should handle errors', async () => {
            Group.findByPk.mockRejectedValue(new Error('Some error'))

            const res = await request(app).get('/groups/1')

            expect(res.status).toBe(400)
            expect(res.text).toBe('Ups! Error')
        })
    })

    describe('createGroup', () => {
        it('should create a new group', async () => {
            const mockGroup = { id: 1, description: 'Group 1' }
            Group.create.mockResolvedValue(mockGroup)

            const res = await request(app).post('/groups').send({ description: 'Group 1' })

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockGroup)
        })

        it('should handle errors', async () => {
            Group.create.mockRejectedValue(new Error('Some error'))

            const res = await request(app).post('/groups').send({ description: 'Group 1' })

            expect(res.status).toBe(400)
            expect(res.text).toBe('Ups! Error')
        })
    })

    describe('updateGroup', () => {
        it('should update a group', async () => {
            const mockGroup = [1]
            Group.update.mockResolvedValue(mockGroup)

            const res = await request(app).put('/groups/1').send({ description: 'Updated Group' })

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockGroup)
        })

        it('should handle errors', async () => {
            Group.update.mockRejectedValue(new Error('Some error'))

            const res = await request(app).put('/groups/1').send({ description: 'Updated Group' })

            expect(res.status).toBe(400)
            expect(res.text).toBe('Ups! Error')
        })
    })

    describe('deleteGroup', () => {
        it('should delete a group', async () => {
            const mockGroup = { id: 1, description: 'Group 1', tasks: [] }
            Group.findByPk.mockResolvedValue(mockGroup)
            Group.destroy.mockResolvedValue(1)

            const res = await request(app).delete('/groups/1')

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockGroup)
        })

        it('should handle errors', async () => {
            Group.findByPk.mockRejectedValue(new Error('Some error'))

            const res = await request(app).delete('/groups/1')

            expect(res.status).toBe(400)
            expect(res.text).toBe('Ups! Error')
        })
    })
})