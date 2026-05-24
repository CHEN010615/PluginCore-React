import { useState } from 'react'
import { Add, ArrowForward, Code, ChevronRight, WaterDrop, LocalFireDepartment, Grass, Egg } from '@mui/icons-material'
import styles from './index.module.scss'

interface ComboItem {
  id: string
  rarity: string
  rarityColor: string
  number: string
  parentA: { icon: React.ReactNode; name: string; color: string }
  parentB: { icon: React.ReactNode; name: string; color: string }
  result: { icon: React.ReactNode; name: string; color: string }
  desc: string
}

const rareCombos: ComboItem[] = [
  {
    id: '1',
    rarity: '高效率',
    rarityColor: '#ffde54',
    number: '#001',
    parentA: { icon: <WaterDrop sx={{ fontSize: 20 }} />, name: '森蟒玛', color: '#78d1ff' },
    parentB: { icon: <WaterDrop sx={{ fontSize: 20 }} />, name: '翠羽射手', color: '#88d5ff' },
    result: { icon: <Egg sx={{ fontSize: 20 }} />, name: '阿努比斯', color: '#ffde54' },
    desc: '最高率的配色，早期即可获取高级材料。',
  },
  {
    id: '2',
    rarity: '传奇级',
    rarityColor: '#ffb9c1',
    number: '#042',
    parentA: { icon: <LocalFireDepartment sx={{ fontSize: 20 }} />, name: '空涡龙', color: '#dc2626' },
    parentB: { icon: <LocalFireDepartment sx={{ fontSize: 20 }} />, name: '空涡龙', color: '#ef4444' },
    result: { icon: <Egg sx={{ fontSize: 20 }} />, name: '空煞胎', color: '#ffde54' },
    desc: '传奇前靠只服通过同类繁衍继承。',
  },
  {
    id: '3',
    rarity: '特殊变异',
    rarityColor: '#78d1ff',
    number: '#098',
    parentA: { icon: <Grass sx={{ fontSize: 20 }} />, name: '暴戾龙', color: '#10b981' },
    parentB: { icon: <WaterDrop sx={{ fontSize: 20 }} />, name: '异种暗星芽', color: '#3b82f6' },
    result: { icon: <Egg sx={{ fontSize: 20 }} />, name: '麒麟监', color: '#ffde54' },
    desc: '获得强力专属性格者的关键配方。',
  },
]

const BreedingPage = () => {
  const [parentASelected, setParentASelected] = useState(false)
  const [parentBSelected, setParentBSelected] = useState(false)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>育种指南</h2>
          <p className={styles.desc}>分析帕鲁育种路径</p>
        </div>
      </header>

      <section className={styles.labSection}>
        <div className={styles.labGrid}>
          <div className={`${styles.parentPanel} glass-panel`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>PARENT A</span>
              <Code sx={{ fontSize: 16, color: '#87929a' }} />
            </div>
            <div className={styles.parentSlot} onClick={() => setParentASelected(!parentASelected)}>
              {!parentASelected && (
                <div className={styles.slotPlaceholder}>
                  <div className={styles.slotIcon}>🐾</div>
                  <span className={styles.slotText}>点击选择帕本</span>
                </div>
              )}
            </div>
            <span className={styles.panelLabel}>— 未选择 —</span>
          </div>

          <div className={styles.controls}>
            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnAdd}`}>
              <Add sx={{ fontSize: 24 }} />
            </button>
            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnArrow}`}>
              <ArrowForward sx={{ fontSize: 22 }} />
            </button>
          </div>

          <div className={`${styles.parentPanel} ${styles.parentPanelSmall} glass-panel`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>PARENT B</span>
            </div>
            <div className={styles.parentSlot} onClick={() => setParentBSelected(!parentBSelected)}>
              {!parentBSelected && (
                <div className={styles.slotPlaceholder}>
                  <div className={styles.slotIcon}>🐾</div>
                  <span className={styles.slotText}>点击选择帕本</span>
                </div>
              )}
            </div>
            <span className={styles.panelLabel}>— 未选择 —</span>
          </div>

          <div className={`${styles.resultPanel} glass-panel`}>
            <div className={styles.resultHeader}>
              <span className={styles.resultTitle}>EXPECTED RESULT</span>
              <span className={styles.legendaryBadge}>LEGENDARY?</span>
            </div>
            <div className={styles.resultBody}>
              <div className={styles.resultImage}>
                <div className={styles.resultImgPlaceholder}>🐺</div>
              </div>
              <h3 className={styles.resultName}>阿努比斯 <span className={styles.resultNameEn}>(Anubis)</span></h3>
              <div className={styles.resultTags}>
                <span className={`${styles.resultTag} ${styles.tagElement}`}>地属性</span>
                <span className={`${styles.resultTag} ${styles.tagWork}`}>工作等级 4</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>攻击力估计</span>
                <span className={styles.statValue}>840 - 920</span>
              </div>
              <div className={styles.statBar}>
                <div className={styles.statFill} style={{ width: '72%', background: 'linear-gradient(90deg, #78d1ff, #3abcf4)' }}>
                  <div className={styles.scanningBar} />
                </div>
              </div>
              <button className={styles.routeBtn}>
                查看详细育种路线 <ChevronRight sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.combosSection}>
        <h3 className={styles.combosTitle}>热门育种公式 (RARE COMBOS)</h3>
        <div className={styles.combosGrid}>
          {rareCombos.map((combo) => (
            <div key={combo.id} className={`${styles.comboCard} glass-panel`}>
              <div className={styles.comboCardHeader}>
                <span className={styles.comboRarity} style={{ backgroundColor: `${combo.rarityColor}22`, color: combo.rarityColor, borderColor: `${combo.rarityColor}44` }}>
                  {combo.rarity}
                </span>
                <span className={styles.comboNumber}>{combo.number}</span>
              </div>
              <div className={styles.comboChain}>
                <div className={styles.comboCircle}>
                  <div className={styles.comboAvatar} style={{ borderColor: `${combo.parentA.color}33`, color: combo.parentA.color }}>
                    {combo.parentA.icon}
                  </div>
                  <span className={styles.comboName} style={{ color: combo.parentA.color }}>{combo.parentA.name}</span>
                </div>
                <span className={styles.comboOp}>×</span>
                <div className={styles.comboCircle}>
                  <div className={styles.comboAvatar} style={{ borderColor: `${combo.parentB.color}33`, color: combo.parentB.color }}>
                    {combo.parentB.icon}
                  </div>
                  <span className={styles.comboName} style={{ color: combo.parentB.color }}>{combo.parentB.name}</span>
                </div>
                <span className={styles.comboArrow}>→</span>
                <div className={`${styles.comboCircle} ${styles.comboResultCircle}`}>
                  <div className={styles.comboResultAvatar} style={{ borderColor: combo.result.color, backgroundColor: `${combo.result.color}15` }}>
                    {combo.result.icon}
                  </div>
                  <span className={styles.comboResultName} style={{ color: combo.result.color }}>{combo.result.name}</span>
                </div>
              </div>
              <p className={styles.comboDesc}>{combo.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default BreedingPage
