export default interface Places {
    listCities(page?: number, limit?: number): object[]
    search(query: string): object[]
}