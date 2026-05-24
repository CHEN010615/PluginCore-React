import { useState } from 'react'
import {
  EmojiEvents,
  FitnessCenter,
  Star,
  SentimentDissatisfied,
  FilterList,
  Sort,
  ChevronRight,
  MilitaryTech,
} from '@mui/icons-material'
import styles from './index.module.scss'

interface PassiveSkill {
  id: string
  name: string
  nameEn: string
  tier: number
  icon: React.ReactNode
  iconColor: string
  effect: string
  type: string
  typeColor: string
  description: string
  acquisitionMethods: string[]
  inheritanceRate: number
  recommendedCombos: string[]
}

const skillsData: PassiveSkill[] = [
  {
    id: 'legend',
    name: '传说',
    nameEn: 'Legend',
    tier: 4,
    icon: <EmojiEvents sx={{ fontSize: 24 }} />,
    iconColor: '#ffd700',
    effect: '攻击+20%, 防御+20%, 移动速度+15%',
    type: '正面',
    typeColor: '#4caf50',
    description:
      '传说中的被动技能，赋予帕鲁全方位的战斗能力提升。拥有此技能的帕鲁在战场上几乎无懈可击，是所有训练师梦寐以求的终极技能。',
    acquisitionMethods: ['自然捕获者', '繁殖传承'],
    inheritanceRate: 25,
    recommendedCombos: ['脑筋', '幸运'],
  },
  {
    id: 'musclehead',
    name: '脑筋',
    nameEn: 'Musclehead',
    tier: 3,
    icon: <FitnessCenter sx={{ fontSize: 24 }} />,
    iconColor: '#ff6b35',
    effect: '攻击+30%, 工作效率50%',
    type: '融合',
    typeColor: '#9c27b0',
    description:
      '强化肌肉与神经连接的被动技能，显著提升攻击力的同时增强工作能力。适合需要兼顾战斗与生产的帕鲁。',
    acquisitionMethods: ['自然捕获者', '繁殖传承', '技能融合'],
    inheritanceRate: 30,
    recommendedCombos: ['传说', '幸运'],
  },
  {
    id: 'lucky',
    name: '幸运',
    nameEn: 'Lucky',
    tier: 2,
    icon: <Star sx={{ fontSize: 24 }} />,
    iconColor: '#78d1ff',
    effect: '攻击+15%, 工作速度+15%',
    type: '正面',
    typeColor: '#4caf50',
    description:
      '被幸运女神眷顾的帕鲁会获得稳定的全面增益。虽然单项提升不如专精技能，但均衡的特性使其适用性极广。',
    acquisitionMethods: ['自然捕获者', '繁殖传承'],
    inheritanceRate: 40,
    recommendedCombos: ['传说', '脑筋'],
  },
  {
    id: 'coward',
    name: '胆小',
    nameEn: 'Coward',
    tier: 1,
    icon: <SentimentDissatisfied sx={{ fontSize: 24 }} />,
    iconColor: '#ff5252',
    effect: '攻击-10%',
    type: '负面',
    typeColor: '#f44336',
    description:
      '性格胆怯的帕鲁在战斗中会表现畏缩，导致攻击力下降。但这类技能有时可以通过特殊配种方案转化为正面效果。',
    acquisitionMethods: ['自然捕获者'],
    inheritanceRate: 50,
    recommendedCombos: [],
  },
]

type FilterType = 'all' | 'positive' | 'negative' | 'work' | 'combat' | 'legend'

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'positive', label: '正面效果' },
  { key: 'negative', label: '负面效果' },
  { key: 'work', label: '工作效率' },
  { key: 'combat', label: '战斗强化' },
  { key: 'legend', label: '传奇级别' },
]

const GlossaryPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedSkill, setSelectedSkill] = useState<PassiveSkill | null>(skillsData[0])

  const filteredSkills = skillsData.filter((skill) => {
    switch (activeFilter) {
      case 'positive':
        return skill.type === '正面'
      case 'negative':
        return skill.type === '负面'
      case 'work':
        return skill.effect.includes('工作')
      case 'combat':
        return skill.effect.includes('攻击') || skill.effect.includes('防御')
      case 'legend':
        return skill.tier === 4
      default:
        return true
    }
  })

  const getTierBadgeClass = (tier: number) => {
    switch (tier) {
      case 4:
        return styles.tier4
      case 3:
        return styles.tier3
      case 2:
        return styles.tier2
      default:
        return styles.tier1
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>
            帕鲁词条
          </h2>
          <p className={styles.desc}>浏览所有词条的详细数据与配种方案</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.actionBtn} glass-panel`}>
            <FilterList sx={{ fontSize: 18 }} />
            筛选
          </button>
          <button className={`${styles.actionBtn} glass-panel`}>
            <Sort sx={{ fontSize: 18 }} />
            排序
          </button>
        </div>
      </header>

      <div className={styles.filterTabs}>
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`${styles.filterTab} ${activeFilter === filter.key ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.skillList}>
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={`${styles.skillCard} glass-panel ${selectedSkill?.id === skill.id ? styles.selected : ''}`}
              onClick={() => setSelectedSkill(skill)}
            >
              <div className={styles.cardMain}>
                <div className={styles.cardLeft}>
                  <div
                    className={styles.skillIcon}
                    style={{
                      borderColor: `${skill.iconColor}66`,
                      backgroundColor: `${skill.iconColor}15`,
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div className={styles.skillInfo}>
                    <div className={styles.skillNameRow}>
                      <h3 className={styles.skillName}>
                        {skill.name}
                        <span className={styles.skillNameEn}>{skill.nameEn}</span>
                      </h3>
                      <span className={`${styles.tierBadge} ${getTierBadgeClass(skill.tier)}`}>
                        <MilitaryTech sx={{ fontSize: 14 }} />
                        TIER{skill.tier}
                      </span>
                    </div>
                    <p className={styles.skillEffect}>{skill.effect}</p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span
                    className={styles.typeTag}
                    style={{
                      color: skill.typeColor,
                      backgroundColor: `${skill.typeColor}18`,
                      borderColor: `${skill.typeColor}33`,
                    }}
                  >
                    {skill.type}
                  </span>
                  <button className={styles.detailLink}>
                    详情 <ChevronRight sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className={styles.loadMore}>加载更多词条...</button>
        </div>

        {selectedSkill && (
          <aside className={`${styles.detailPanel} glass-panel`}>
            <div className={styles.panelHeader}>
              <div
                className={styles.panelIcon}
                style={{
                  borderColor: `${selectedSkill.iconColor}66`,
                  backgroundColor: `${selectedSkill.iconColor}15`,
                }}
              >
                {selectedSkill.icon}
              </div>
              <div>
                <h3 className={styles.panelTitle}>
                  {selectedSkill.name} <span className={styles.panelTitleSub}>详细资料</span>
                </h3>
                <span className={`${styles.tierBadge} ${getTierBadgeClass(selectedSkill.tier)}`}>
                  TIER{selectedSkill.tier}
                </span>
              </div>
            </div>

            <div className={styles.panelSection}>
              <h4 className={styles.sectionTitle}>技能描述</h4>
              <p className={styles.panelDesc}>{selectedSkill.description}</p>
            </div>

            <div className={styles.panelSection}>
              <h4 className={styles.sectionTitle}>获取方式</h4>
              <ul className={styles.acquisitionList}>
                {selectedSkill.acquisitionMethods.map((method, idx) => (
                  <li key={idx} className={styles.acquisitionItem}>
                    <ChevronRight sx={{ fontSize: 16, color: '$primary-color' }} />
                    {method}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.panelSection}>
              <h4 className={styles.sectionTitle}>遗传概率</h4>
              <div className={styles.inheritanceBar}>
                <div className={styles.inheritanceLabel}>
                  <span>单亲本</span>
                  <span>{selectedSkill.inheritanceRate}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${selectedSkill.inheritanceRate}%` }}
                  ></div>
                  <div className={styles.progressScan}></div>
                </div>
              </div>
            </div>

            <button className={styles.breedButton}>
              查看配种方案 <ChevronRight sx={{ fontSize: 18 }} />
            </button>

            {selectedSkill.recommendedCombos.length > 0 && (
              <div className={styles.panelSection}>
                <h4 className={styles.sectionTitle}>推荐组合</h4>
                <div className={styles.comboTags}>
                  {selectedSkill.recommendedCombos.map((combo, idx) => (
                    <span key={idx} className={styles.comboTag}>
                      {combo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}

export default GlossaryPage
