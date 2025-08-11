import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Settings, Maximize } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Video Learning Platform
        </h1>
        <p className="text-muted-foreground">
          Learn English with interactive videos and subtitles
        </p>
      </header>

      {/* Video Player Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full w-16 h-16">
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Play className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 bg-white/30 rounded-full h-1">
                    <div className="bg-primary w-1/3 h-full rounded-full"></div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Subtitle Area */}
            <div className="p-6 bg-card">
              <h3 className="font-semibold mb-4">Subtitles</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <div className="p-3 bg-primary/10 rounded-md border-l-4 border-primary">
                  <p className="text-sm">Hello, welcome to our English learning platform!</p>
                  <span className="text-xs text-muted-foreground">00:05 - 00:08</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">Today we'll learn about daily conversations.</p>
                  <span className="text-xs text-muted-foreground">00:09 - 00:12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Gallery Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Video Library</h3>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 bg-card rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium truncate">
                      Lesson {i + 1}: Basic Conversations
                    </h4>
                    <p className="text-xs text-muted-foreground">5:30</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">Settings</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Subtitle Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="w-4 h-4 mr-2" />
                Audio Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
