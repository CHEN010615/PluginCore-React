import { MenuBook, Egg, Map, AutoAwesome } from '@mui/icons-material'
import styles from './Sidebar.module.scss'

interface NavItem {
  icon: React.ReactNode
  label: string
  key: string
}

const navItems: NavItem[] = [
  { icon: <MenuBook sx={{ fontSize: 20 }} />, label: '帕鲁图鉴', key: 'wiki' },
  { icon: <Egg sx={{ fontSize: 20 }} />, label: '育种指南', key: 'breeding' },
  { icon: <Map sx={{ fontSize: 20 }} />, label: '资源地图', key: 'map' },
  { icon: <AutoAwesome sx={{ fontSize: 20 }} />, label: '帕鲁词条', key: 'glossary' },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (key: string) => void
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className={styles.logoTitle}>帕鲁指挥部</h1>
        <p className={styles.logoVersion}>V0.0.1 测试版</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item.key}
            className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onTabChange(item.key)
            }}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.upgrade}>
        <button className={styles.upgradeBtn}>升级</button>
      </div>
    </aside>
  )
}

export default Sidebar
