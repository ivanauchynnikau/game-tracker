function TennisCourt() {
  return (
    <div className="w-full bg-court-green rounded-lg overflow-hidden shadow-lg">
      <div className="aspect-[10/11] relative p-2">
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="10" y="10" width="180" height="200" fill="#2E7D32" stroke="white" strokeWidth="2" />
          
          <line x1="10" y1="110" x2="190" y2="110" stroke="white" strokeWidth="2" />
          
          <line x1="50" y1="10" x2="50" y2="210" stroke="white" strokeWidth="1.5" />
          <line x1="150" y1="10" x2="150" y2="210" stroke="white" strokeWidth="1.5" />
          
          <line x1="100" y1="60" x2="100" y2="160" stroke="white" strokeWidth="1.5" />
          
          <rect x="50" y="60" width="100" height="50" fill="none" stroke="white" strokeWidth="1.5" />
          <rect x="50" y="110" width="100" height="50" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}

export default TennisCourt
