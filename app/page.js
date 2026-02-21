import Link from 'next/link';
import { ArrowRight, Sparkles, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'AIBlog | Next-Gen AI Blogging Platform',
    description: 'Turn your notes into polished, engaging blog posts in seconds using advanced AI models.',
};

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-6 px-8 flex justify-between items-center glass-panel m-4 rounded-full border border-white/10 sticky top-4 z-50 shadow-xl">
                <div className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 flex items-center gap-2">
                    <Sparkles className="text-blue-400" size={24} /> AIBlog
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild className="rounded-full">
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg shadow-blue-500/25">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center -mt-10 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Turn your messy notes into <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400">
                            polished masterpieces
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Write down your thoughts, upload images, and drop YouTube links.
                        Our advanced AI takes care of the formatting, expansion, and structure to create stunning blog posts ready to publish.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Button size="lg" asChild className="rounded-full text-base px-8 h-14 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-xl shadow-blue-500/25 transition-all hover:scale-105">
                            <Link href="/register">
                                Start Creating for Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="lg" asChild className="rounded-full text-base px-8 h-14 text-slate-300 hover:text-white transition-colors">
                            <Link href="#features">
                                See how it works
                            </Link>
                        </Button>
                    </div>
                </div>

                <div id="features" className="mt-32 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-20">
                    <FeatureCard
                        icon={<Sparkles className="text-blue-400 mb-4" size={32} />}
                        title="AI-Powered Generation"
                        description="Leverage top-tier models from NVIDIA, Anthropic, and Google to intelligently expand and structure your raw thoughts."
                    />
                    <FeatureCard
                        icon={<ImageIcon className="text-violet-400 mb-4" size={32} />}
                        title="Seamless Media"
                        description="Drag and drop images seamlessly. The AI automatically positions them perfectly within your generated article."
                    />
                    <FeatureCard
                        icon={<Video className="text-fuchsia-400 mb-4" size={32} />}
                        title="YouTube Integration"
                        description="Easily embed videos. The AI understands the context and naturally references them in your blog post."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover:bg-slate-900/80 transition-all duration-300 group hover:-translate-y-1">
            <CardHeader>
                <div className="transform group-hover:scale-110 transition-transform duration-300 origin-left mb-2">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-slate-400 text-base leading-relaxed">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
