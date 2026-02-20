import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getBlogs } from '@/lib/storage';
import Link from 'next/link';
import { Clock, Eye, ExternalLink, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
    const token = (await cookies()).get('auth-token')?.value;
    const user = await verifyToken(token);

    const blogs = await getBlogs(user.username);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    Your Dashboard
                </h1>
                <p className="text-slate-400 mt-2">Manage your AI generated blogs and track their performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-400 text-sm font-medium tracking-normal">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{blogs.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-400 text-sm font-medium tracking-normal">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">
                            {blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-semibold">Recent Posts</h2>
                    <Button variant="ghost" asChild className="text-blue-400 hover:text-blue-300">
                        <Link href="/dashboard/new">
                            Create New &rarr;
                        </Link>
                    </Button>
                </div>

                {blogs.length === 0 ? (
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 text-center py-12">
                        <CardContent>
                            <h3 className="text-lg font-medium text-slate-300 mb-2">No posts yet</h3>
                            <p className="text-slate-400 mb-6">Create your first AI generated blog post based on your notes.</p>
                            <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
                                <Link href="/dashboard/new">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Start Generating
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {blogs.map(blog => (
                            <Card key={blog.id} className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover:bg-slate-900/80 transition-colors">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-slate-200">{blog.title}</h3>
                                        <div className="flex gap-4 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDistanceToNow(new Date(blog.date))} ago</span>
                                            <span className="flex items-center gap-1.5"><Eye size={14} /> {blog.views || 0} views</span>
                                            <Badge variant="secondary" className="bg-white/10 text-slate-300 hover:bg-white/20 font-normal">{blog.category}</Badge>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="icon" asChild className="border-white/10 bg-transparent hover:bg-white/10 text-slate-300">
                                        <Link href={`/blog/${user.username}/${blog.slug}`} target="_blank">
                                            <ExternalLink size={18} />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
