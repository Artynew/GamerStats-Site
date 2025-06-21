function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="w-screen h-screen flex flex-col bg-gray-900 text-white">
        
        <div className="shrink-0">
          <header className="bg-gray-900 px-6 py-4 shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <span className="text-xl font-bold">GamerStats</span>
              
            </div>
          </header>
        </div>
  
        
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-md bg-gray-900 p-6 rounded shadow">
            {children}
          </div>
        </div>
      </div>
    )
  }
  
  export default Layout
  