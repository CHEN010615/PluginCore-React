import { useState } from 'react'
import { WaterDrop, LocalFireDepartment, Grass, Lock, Bolt, AcUnit, Psychology, Star, Favorite, Cyclone, Pets } from '@mui/icons-material'
import styles from './index.module.scss'
import PalDetailDrawer from './PalDetailDrawer'

interface PalCard {
  id: string
  number: string
  name: string
  description: string
  tier: string
  type: 'water' | 'fire' | 'grass'
  typeIcon: React.ReactNode
  typeColor: string
  gradient: string
  tags: React.ReactNode[]
}

interface PalDetail {
  number: string
  name: string
  nameEn: string
  type: string
  typeColor: string
  typeIcon: React.ReactNode
  level: number
  stats: { label: string; value: string | number; percent: number; color: string }[]
  breeding: { parentAIcon: React.ReactNode; parentBIcon: React.ReactNode; childName: string }
  skills: { name: string; desc: string; icon: React.ReactNode; bgColor: string }[]
}

const palCards: PalCard[] = [
  {
    id: '1',
    number: '001',
    name: '霜歌龙',
    description: '冰蓝色的羽翼在月光下闪烁，是寒冷地带的守护者。',
    tier: 'Tier A',
    type: 'water',
    typeIcon: <WaterDrop sx={{ fontSize: 16 }} />,
    typeColor: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(21, 94, 117, 0.2))',
    tags: [<Bolt key="bolt" sx={{ fontSize: 14, color: '#ffde54' }} />, <AcUnit key="acunit" sx={{ fontSize: 14, color: '#78d1ff' }} />],
  },
  {
    id: '2',
    number: '074',
    name: '燧龙',
    description: '体内蕴含熔岩之力，所到之处皆为焦土。',
    tier: 'Tier S',
    type: 'fire',
    typeIcon: <LocalFireDepartment sx={{ fontSize: 16 }} />,
    typeColor: '#dc2626',
    gradient: 'linear-gradient(135deg, rgba(124, 45, 18, 0.4), rgba(153, 27, 27, 0.2))',
    tags: [<Star key="star1" sx={{ fontSize: 14, color: '#ffde54' }} />, <Star key="star2" sx={{ fontSize: 14, color: '#ffde54' }} />],
  },
  {
    id: '3',
    number: '012',
    name: '翠叶鼠',
    description: '擅长在丛林中快速移动，是极佳的采集助手。',
    tier: 'Tier C',
    type: 'grass',
    typeIcon: <Grass sx={{ fontSize: 16 }} />,
    typeColor: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(20, 83, 45, 0.4), rgba(6, 95, 70, 0.2))',
    tags: [<Psychology key="psy" sx={{ fontSize: 14, color: '#78d1ff' }} />],
  },
]

const palDetailMap: Record<string, PalDetail> = {
  '1': {
    number: '001',
    name: '霜歌龙',
    nameEn: 'Frostwing',
    type: 'water',
    typeColor: '#3b82f6',
    typeIcon: <WaterDrop sx={{ fontSize: 20 }} />,
    level: 45,
    stats: [
      { label: '攻击力 ATTACK', value: '1,240', percent: 75, color: '#78d1ff' },
      { label: '防御力 DEFENSE', value: '980', percent: 60, color: '#ffde54' },
      { label: '工作适应性 SUITABILITY', value: 'LV. 3', percent: 85, color: '#ffb9c1' },
    ],
    breeding: {
      parentAIcon: <Pets sx={{ fontSize: 18, color: '#78d1ff' }} />,
      parentBIcon: <Pets sx={{ fontSize: 18, color: '#ffde54' }} />,
      childName: '霜歌龙',
    },
    skills: [
      { name: '寒冰射线', desc: '发射强力冻气，有概率冻结目标。', icon: <AcUnit sx={{ fontSize: 18 }} />, bgColor: 'rgba(59, 130, 246, 0.2)' },
      { name: '暴风雪', desc: '在大范围内制造冰雪风暴。', icon: <Cyclone sx={{ fontSize: 18 }} />, bgColor: 'rgba(96, 165, 250, 0.2)' },
    ],
  },
  '2': {
    number: '074',
    name: '燧龙',
    nameEn: 'Inferno',
    type: 'fire',
    typeColor: '#dc2626',
    typeIcon: <LocalFireDepartment sx={{ fontSize: 20 }} />,
    level: 52,
    stats: [
      { label: '攻击力 ATTACK', value: '1,580', percent: 90, color: '#ffde54' },
      { label: '防御力 DEFENSE', value: '720', percent: 45, color: '#78d1ff' },
      { label: '工作适应性 SUITABILITY', value: 'LV. 2', percent: 55, color: '#ffb9c1' },
    ],
    breeding: {
      parentAIcon: <Pets sx={{ fontSize: 18, color: '#dc2626' }} />,
      parentBIcon: <Pets sx={{ fontSize: 18, color: '#10b981' }} />,
      childName: '燧龙',
    },
    skills: [
      { name: '烈焰吐息', desc: '喷出高温火焰灼烧前方敌人。', icon: <LocalFireDepartment sx={{ fontSize: 18 }} />, bgColor: 'rgba(220, 38, 38, 0.2)' },
      { name: '熔岩爆发', desc: '从地面喷发熔岩造成范围伤害。', icon: <Bolt sx={{ fontSize: 18 }} />, bgColor: 'rgba(251, 146, 60, 0.2)' },
    ],
  },
  '3': {
    number: '012',
    name: '翠叶鼠',
    nameEn: 'Verdmouse',
    type: 'grass',
    typeColor: '#10b981',
    typeIcon: <Grass sx={{ fontSize: 20 }} />,
    level: 28,
    stats: [
      { label: '攻击力 ATTACK', value: '420', percent: 28, color: '#78d1ff' },
      { label: '防御力 DEFENSE', value: '380', percent: 25, color: '#ffde54' },
      { label: '工作适应性 SUITABILITY', value: 'LV. 4', percent: 92, color: '#ffb9c1' },
    ],
    breeding: {
      parentAIcon: <Favorite sx={{ fontSize: 18, color: '#10b981' }} />,
      parentBIcon: <Favorite sx={{ fontSize: 18, color: '#78d1ff' }} />,
      childName: '翠叶鼠',
    },
    skills: [
      { name: '藤蔓缠绕', desc: '用藤蔓束缚敌人并吸取体力。', icon: <Grass sx={{ fontSize: 18 }} />, bgColor: 'rgba(16, 185, 129, 0.2)' },
      { name: '自然治愈', desc: '缓慢恢复自身与队友的生命值。', icon: <Psychology sx={{ fontSize: 18 }} />, bgColor: 'rgba(52, 211, 153, 0.2)' },
    ],
  },
}

const WikiPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState<PalDetail | null>(null)

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    setDrawerData(palDetailMap[id])
    setDrawerOpen(true)
  }

  const handleClose = () => {
    setDrawerOpen(false)
    setSelectedId(null)
    setTimeout(() => setDrawerData(null), 400)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>帕鲁图鉴</h2>
          <p className={styles.desc}>浏览所有帕鲁的详细数据</p>
        </div>
        {/* <div className={styles.badges}>
          <span className={`${styles.badge} ${styles.badgePrimary}`}>已发现: 111/137</span>
          <span className={`${styles.badge} ${styles.badgeSecondary}`}>稀有: 12</span>
        </div> */}
      </header>

      <div className={styles.grid}>
        {palCards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} glass-panel pal-card-glow`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={styles.cardImage} style={{ background: card.gradient }}>
              <div className={styles.cardNumber}>
                <span className={styles.cardNumberText}>No. {card.number}</span>
              </div>
              <div className={styles.cardType}>
                <div
                  className={styles.typeBadge}
                  style={{ backgroundColor: card.typeColor }}
                  title={card.type}
                >
                  {card.typeIcon}
                </div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardName}>{card.name}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardTier}>{card.tier}</span>
                <div className={styles.cardTags}>{card.tags}</div>
              </div>
            </div>
          </div>
        ))}

        <div className={`${styles.card} ${styles.cardLocked} glass-panel`}>
          <div className={styles.cardLockedContent}>
            <Lock sx={{ fontSize: 36, color: '#546e7a' }} />
            <p className={styles.cardLockedText}>数据未解锁</p>
          </div>
        </div>
      </div>

      <PalDetailDrawer
        open={drawerOpen}
        onClose={handleClose}
        data={drawerData}
      />
    </>
  )
}

export default WikiPage
