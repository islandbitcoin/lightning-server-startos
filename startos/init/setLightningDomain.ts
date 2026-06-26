import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getHttpInterfaceUrls, hostFromUrl } from '../utils'

export const setLightningDomain = sdk.setupOnInit(async (effects: any) => {
  const currentDomain = await storeJson.read((s) => s.domain).const(effects)
  const hosts = (await getHttpInterfaceUrls(effects)).map(hostFromUrl)
  const preferred =
    hosts.find((host) => !host.endsWith('.local') && !host.endsWith('.embassy'))
  if (preferred && (!currentDomain || !hosts.includes(currentDomain))) {
    await storeJson.merge(
      effects,
      { domain: preferred },
      { allowWriteAfterConst: true },
    )
  }
})
