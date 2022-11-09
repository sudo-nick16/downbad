const request = require('supertest');
const server = require('.');

describe("Test /api/:vidId", () => {
    it("Should return 200", async () => {
        const res = await request(server).get("/api/aXojYqEOOkk")
        expect(res.statusCode).toEqual(200)
    })
    it("Should return 400", async () => {
        const res = await request(server).get("/api/6rZxvKs1Nsg")
        expect(res.statusCode).toEqual(400)
    })
    it("Should return 400", async () => {
        const res = await request(server).get("/api/invalid")
        expect(res.statusCode).toEqual(400)
    })
    afterAll(() => {
        server.close()
    })
});
