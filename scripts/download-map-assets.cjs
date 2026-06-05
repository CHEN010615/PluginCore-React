const fs = require('node:fs/promises')
const { createWriteStream } = require('node:fs')
const https = require('node:https')
const path = require('node:path')

const ROOT_DIR = __dirname
const ASSETS_FILE = path.join(ROOT_DIR, 'src/components/MainContent/pages/map/mapAssets.ts')
const OUTPUT_DIR = path.join(ROOT_DIR, 'src/static/img/map')
const CONCURRENCY = 8
const PALDB_IMAGE_BASE = 'https://www.paldb.cn/images'
const REMOTE_MARKER_ICON_URLS = {
  alphaPal: `${PALDB_IMAGE_BASE}/ui/T_icon_compass_06_2.webp`,
  enemyBase: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_11.webp`,
  rampage: `${PALDB_IMAGE_BASE}/ui/T_icon_compass_06_2.webp`,
  bounty: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_Bounty.webp`,
  tower: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_tower.webp`,
  cave: `${PALDB_IMAGE_BASE}/ui/door5.webp`,
  event: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/Main_Menu/T_icon_unknown.webp`,
  bondFruit: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Consume_AffectionFruit_01.webp`,
  nightstarSand: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_NightStone.webp`,
  skillTree: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Consume_SkillCard_Neutral.webp`,
  crudeOil: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_CrudeOil.webp`,
  junk: `${PALDB_IMAGE_BASE}/ui/Wood_Planks_Icon.webp`,
  elementalChest: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
  treasure: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
  beautifulFlower: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Food_Poppy.webp`,
  supply: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_16.webp`,
  heatSource: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_palwork_00.webp`,
  treasureMap: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_TreasureMap_01.webp`,
  antiAir: `${PALDB_IMAGE_BASE}/Pal/Texture/BuildObject/PNG/T_icon_buildObject_efenseBulletLauncher_Missile.webp`,
  fastTravel: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_FTtower.webp`,
  dungeon: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_dungeon.webp`,
  home: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_07.webp`,
  respawn: `${PALDB_IMAGE_BASE}/ui/T_worldmap_icon_fasttravel.webp`,
  region: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_00.webp`,
  fishing: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Weapon_FishingRod_1.webp`,
  salvage1: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
  salvage2: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
  fairyEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Water_01.webp`,
  grassEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Leaf_01.webp`,
  volcanoEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Fire_01.webp`,
  frozenEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Ice_01.webp`,
  desertEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Earth_01.webp`,
  sakuraEgg: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_PalEgg_Dragon_01.webp`,
  chromite: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Chromium.webp`,
  hexolite: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_RainbowCrystal.webp`,
  pureQuartz: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Quartz.webp`,
  pureQuartzCluster: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Quartz_Cluster4.webp`,
  sulfur: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Sulfur.webp`,
  sulfurCluster: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Sulfur_Cluster4.webp`,
  ore: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_CopperOre.webp`,
  oreCluster: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_CopperOre_Cluster4.webp`,
  coal: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Coal.webp`,
  coalCluster: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Coal_Cluster4.webp`,
  wanderingMerchant: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Material_Money.webp`,
  blackMarketeer: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_PalSphere_Legend.webp`,
  npc: `${PALDB_IMAGE_BASE}/Pal/Texture/PalIcon/Normal/T_CommonHuman_icon_normal.webp`,
  palCritic: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_11.webp`,
  lifmunkEffigy: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Relic.webp`,
  journal: `${PALDB_IMAGE_BASE}/ui/memo.webp`,
  graffitiInk: `${PALDB_IMAGE_BASE}/Others/InventoryItemIcon/Texture/T_itemicon_Ammo_InkBullet.webp`,
  unknown: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/Main_Menu/T_icon_unknown.webp`,
  torch: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_construction_tab_05.webp`,
  test: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_construction_tab_05.webp`,
  oilrigTreasure: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
  oilrigBigTreasure: `${PALDB_IMAGE_BASE}/Pal/Texture/UI/InGame/T_icon_compass_02.webp`,
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    force: false,
    dryRun: false,
    iconsOnly: false,
    tilesOnly: false,
    minZoom: undefined,
    maxZoom: undefined,
  }

  for (const arg of args) {
    if (arg === '--force') options.force = true
    if (arg === '--dry-run') options.dryRun = true
    if (arg === '--icons-only') options.iconsOnly = true
    if (arg === '--tiles-only') options.tilesOnly = true
    if (arg.startsWith('--min-zoom=')) options.minZoom = Number(arg.split('=')[1])
    if (arg.startsWith('--max-zoom=')) options.maxZoom = Number(arg.split('=')[1])
  }

  if (options.iconsOnly && options.tilesOnly) {
    throw new Error('Use only one of --icons-only or --tiles-only.')
  }

  return options
}

function parseNumberConst(source, name) {
  const match = source.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(\\d+)`))
  if (!match) throw new Error(`Missing ${name} in mapAssets.ts`)
  return Number(match[1])
}

function parseImageBase(source) {
  const match = source.match(/const\s+PALDB_IMAGE_BASE\s*=\s*['"]([^'"]+)['"]/)
  return match ? match[1] : PALDB_IMAGE_BASE
}

function parseMarkerIconUrls(source, imageBase) {
  const objectMatch = source.match(/export\s+const\s+mapMarkerIconUrls\s*=\s*\{([\s\S]*?)\n\}/)
  if (!objectMatch) throw new Error('Missing mapMarkerIconUrls in mapAssets.ts')

  const iconUrls = []
  const entryPattern = /(\w+):\s*`([^`]+)`/g
  let match

  while ((match = entryPattern.exec(objectMatch[1]))) {
    const [, key] = match
    const url = REMOTE_MARKER_ICON_URLS[key]
    if (!url) throw new Error(`Missing remote URL for icon key ${key}`)
    iconUrls.push({
      kind: 'icon',
      key,
      url,
    })
  }

  return iconUrls
}

function buildTileUrls(source, imageBase, options) {
  const minZoom = options.minZoom ?? parseNumberConst(source, 'MAP_MIN_TILE_ZOOM')
  const maxZoom = options.maxZoom ?? parseNumberConst(source, 'MAP_MAX_TILE_ZOOM')
  const urls = []

  if (!Number.isInteger(minZoom) || !Number.isInteger(maxZoom) || minZoom < 0 || maxZoom < minZoom) {
    throw new Error(`Invalid zoom range: ${minZoom}-${maxZoom}`)
  }

  for (let zoom = minZoom; zoom <= maxZoom; zoom += 1) {
    const tileCount = 2 ** zoom
    for (let y = 0; y < tileCount; y += 1) {
      for (let x = 0; x < tileCount; x += 1) {
        urls.push({
          kind: 'tile',
          key: `z${zoom}x${x}y${y}`,
          zoom,
          x,
          y,
          url: `${imageBase}/map1/z${zoom}x${x}y${y}.webp`,
        })
      }
    }
  }

  return urls
}

function extensionFromUrl(url) {
  const parsed = new URL(url)
  const ext = path.extname(parsed.pathname)
  return ext || '.webp'
}

function outputPathFor(asset) {
  if (asset.kind === 'tile') {
    return path.join(OUTPUT_DIR, 'tiles', `z${asset.zoom}`, `x${asset.x}y${asset.y}${extensionFromUrl(asset.url)}`)
  }

  return path.join(OUTPUT_DIR, 'icons', `${asset.key}${extensionFromUrl(asset.url)}`)
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function download(url, filePath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      const { statusCode, headers } = response

      if ([301, 302, 303, 307, 308].includes(statusCode) && headers.location) {
        response.resume()
        if (redirectCount >= 5) {
          reject(new Error(`Too many redirects for ${url}`))
          return
        }
        resolve(download(new URL(headers.location, url).toString(), filePath, redirectCount + 1))
        return
      }

      if (statusCode !== 200) {
        response.resume()
        reject(new Error(`HTTP ${statusCode} for ${url}`))
        return
      }

      const stream = createWriteStream(filePath)
      response.pipe(stream)
      stream.on('finish', () => stream.close(resolve))
      stream.on('error', reject)
    })

    request.setTimeout(30000, () => {
      request.destroy(new Error(`Timeout downloading ${url}`))
    })
    request.on('error', reject)
  })
}

async function runQueue(items, worker) {
  let index = 0
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index]
      index += 1
      await worker(item)
    }
  })

  await Promise.all(workers)
}

async function main() {
  const options = parseArgs()
  const source = await fs.readFile(ASSETS_FILE, 'utf8')
  const imageBase = parseImageBase(source)
  const assets = [
    ...(options.tilesOnly ? [] : parseMarkerIconUrls(source, imageBase)),
    ...(options.iconsOnly ? [] : buildTileUrls(source, imageBase, options)),
  ]

  let skipped = 0
  let downloaded = 0
  const failed = []

  if (options.dryRun) {
    const iconCount = assets.filter((asset) => asset.kind === 'icon').length
    const tileCount = assets.filter((asset) => asset.kind === 'tile').length
    process.stdout.write(`Dry run. icons=${iconCount} tiles=${tileCount} total=${assets.length} output=${OUTPUT_DIR}\n`)
    for (const asset of assets.slice(0, 20)) {
      process.stdout.write(`${asset.kind}:${asset.key} -> ${outputPathFor(asset)}\n`)
    }
    if (assets.length > 20) {
      process.stdout.write(`... ${assets.length - 20} more assets\n`)
    }
    return
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  await runQueue(assets, async (asset) => {
    const filePath = outputPathFor(asset)
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    if (!options.force && await fileExists(filePath)) {
      skipped += 1
      return
    }

    try {
      await download(asset.url, filePath)
      downloaded += 1
      process.stdout.write(`downloaded ${asset.kind}:${asset.key}\n`)
    } catch (error) {
      failed.push({ asset, error })
      process.stderr.write(`failed ${asset.kind}:${asset.key} ${error.message || error.code || 'unknown error'}\n`)
    }
  })

  process.stdout.write(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed.length} output=${OUTPUT_DIR}\n`)

  if (failed.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`)
  process.exit(1)
})
