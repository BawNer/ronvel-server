type accountObject = {game?: string, account?: object}

export class TextToJsonHelper {
  protected logFile: string

  constructor (payload: string) {
    this.logFile = JSON.parse(payload)
  }

  protected makeArray(): string[] {
    return this.logFile.replace(/[^a-zа-яё0-9\s]/gi, ' ').replace(/\s+/g, ' ').split(' ')
  }

  protected splitArray(): Array<string[]> {
    const arrayList: Array<string[]> = [[]]
    let currentIndexArrayList = 0
    this.makeArray().forEach((element) => {

      if (element === 'BruteChecker') {
        arrayList.push([])
        currentIndexArrayList++
      } else {
        !!element.length ? arrayList[currentIndexArrayList].push(element) : false
      }

    })

    return arrayList.filter(a => a.length)
  }

  public makeJson(): string {
    const obj: Array<accountObject> = []
    this.splitArray().forEach((nodeArr: string[]) => {

      const validObj: accountObject = {}

      obj.push(validObj)

      const objIndex: number = obj.length - 1
      const usernameStartIndex: number = nodeArr.indexOf('Username') + 1
      const usernameEndIndex: number = nodeArr.indexOf('Ban')
      const regionIndex: number = nodeArr.indexOf('Region')
      const countryIndex: number = nodeArr.indexOf('Country')
      const skinCountIndex: number = nodeArr.indexOf('Skins')
      const skinsIndex: number = nodeArr.indexOf('Skins', skinCountIndex + 1)
      const matchIndexStart: number = nodeArr.indexOf('match')
      const matchIndexEnd: number = nodeArr.indexOf('Competitive')
      const rankStartIndex: number = nodeArr.indexOf('rank')
      const rankEndIndex: number = nodeArr.indexOf('Agents')
      const banIndex: number = nodeArr.indexOf('Ban')
      const valorantPointsIndex: number = nodeArr.indexOf('VP')
      let lastMatch: string = ''
      let skins: string[] = []
      let username: string = ''
      let rank: string[] = []

      for (let i: number = rankStartIndex + 1; i < rankEndIndex; i += 2) {
        rank.push(`${nodeArr[i]} ${nodeArr[i + 1]}`)
      }

      for (let i = matchIndexStart + 1; i < matchIndexEnd - 3; i++) {
        (matchIndexEnd - 4) - i !== 0 ? lastMatch += nodeArr[i] + '-' : lastMatch += nodeArr[i]
      }

      for (let i = skinsIndex + 1; i < nodeArr.length; i++) {
        skins.push(nodeArr[i])
      }

      for (let i = usernameStartIndex; i < usernameEndIndex; i++) {
        ((usernameEndIndex - 1) - i) === 0 ? username += "#" + nodeArr[i] : username += nodeArr[i]
      }

      obj[objIndex].game = nodeArr[0]

      obj[objIndex].account = {
        login: nodeArr[2],
        password: nodeArr[3],
        username,
        region: {
          index: nodeArr[regionIndex + 1],
          country: nodeArr[countryIndex + 1]
        },
        ban: nodeArr[banIndex+1],
        valorantPoints: nodeArr[valorantPointsIndex+1],
        lastMatch: new Date(lastMatch).getTime(),
        rank,
        skinCount: nodeArr[skinCountIndex + 2],
        skins
      }
    })

    return JSON.stringify(obj)
  }

}