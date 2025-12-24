export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/20 backdrop-blur-xl bg-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              🗳️ Stacks Voting
            </h3>
            <p className="text-white/80 text-sm">
              Decentralized governance platform powered by Stacks blockchain technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/create" className="hover:text-white transition-colors">Create Proposal</a></li>
              <li><a href="/stats" className="hover:text-white transition-colors">Statistics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Stacks.co</a></li>
              <li><a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
          <p>© 2025 Stacks Voting. Built with ❤️ on the Stacks blockchain.</p>
        </div>
      </div>
    </footer>
  );
}
