import React from 'react'

// Material Symbols Outlined icon names
type MaterialIconName =
  | 'add'
  | 'remove'
  | 'close'
  | 'bolt'
  | 'visibility'
  | 'lock'
  | 'warning'
  | 'history'
  | 'settings'
  | 'hub'
  | 'person'
  | 'search'
  | 'touch_app'
  | 'label_important'
  | 'keyboard'
  | 'toggle_on'
  | 'notifications'
  | 'tab'
  | 'dns'
  | 'memory'
  | 'language'
  | 'security'
  | 'monitoring'
  | 'terminal'
  | 'arrow_drop_down'
  | 'downloading'
  | 'close'
  | 'error'
  | 'filter_list'
  | 'refresh'
  | 'check'
  | 'visibility_off'

interface MaterialIconsProps {
  icon: MaterialIconName
  className?: string
}

export const MaterialSymbolsOutlined: React.FC<MaterialIconsProps> = ({
  icon,
  className = '',
}) => {
  return <span className={`material-symbols-outlined ${className}`}>{icon}</span>
}
