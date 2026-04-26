import { CategoryList } from './CategoryList'
import { CampusInfoPanel } from './CampusInfoPanel'
import { SearchPanel } from './SearchPanel'

export function SidebarContent() {
  return (
    <div className="flex min-h-full flex-col gap-3.5 bg-transparent p-4">
      <CampusInfoPanel />
      <SearchPanel />
      <CategoryList />
    </div>
  )
}
