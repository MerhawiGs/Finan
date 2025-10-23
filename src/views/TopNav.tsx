export default function TopNav() {
    return (
        <header className="p-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-20">
            <h1 className="text-2xl font-extrabold text-gray-900">
                Hi, Alex!
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-500">
                    Oct 2025
                </span>
            </div>
        </header>
    )
}