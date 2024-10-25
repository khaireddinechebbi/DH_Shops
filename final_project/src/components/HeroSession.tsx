

export default function HeroSession() {
    return (
      <section style={{
        backgroundImage: 'url("/156362.jpg")',
        }}>
        
        <div className="relative overflow-hidden py-24 lg:py-32">
          <div className="container">
            <div className="mt-10 relative max-w-5xl mx-auto">
              <div className="absolute bottom-12 -start-20 -z-[1] w-48 h-48 bg-gradient-to-b from-primary-foreground via-primary-foreground to-background p-px rounded-lg">
                <div className="w-48 h-48 rounded-lg bg-background/10" />
              </div>
              <div className="absolute -top-12 -end-20 -z-[1] w-48 h-48 bg-gradient-to-t from-primary-foreground via-primary-foreground to-background p-px rounded-full">
                <div className="w-48 h-48 rounded-full bg-background/10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  