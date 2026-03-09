import axios from "axios"
import * as cheerio from "cheerio"

async function test() {
    const { data } = await axios.get("https://www.crazygames.com/")
    const $ = cheerio.load(data)
    const jsonText = $("#__NEXT_DATA__").html()
    if (jsonText) {
        const json = JSON.parse(jsonText)
        function findGames(obj: any): any[] {
            if (!obj || typeof obj !== 'object') return []
            if (Array.isArray(obj)) {
                if (obj.length > 0 && obj[0].name && obj[0].slug) return obj
                return obj.flatMap(findGames)
            }
            return Object.values(obj).flatMap(findGames)
        }
        const games = findGames(json)
        if (games.length > 0) {
            console.log("Cover:", JSON.stringify(games[0].cover, null, 2))
        }
    }
}
test()
