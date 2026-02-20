import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getBlogs } from '@/lib/storage';
import Link from 'next/link';
import { Clock, Eye, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <div className="text-slate-400 text-sm font-medium">Total Posts</div>
                    <div className="text-4xl font-bold mt-2 text-white">{blogs.length}</div>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <div className="text-slate-400 text-sm font-medium">Total Views</div>
                    <div className="text-4xl font-bold mt-2 text-white">
                        {blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-semibold">Recent Posts</h2>
                    <Link href="/dashboard/new" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                        Create New &rarr;
                    </Link>
                </div>

                {blogs.length === 0 ? (
                    <div className="glass-panel p-12 text-center">
                        <h3 className="text-lg font-medium text-slate-300 mb-2">No posts yet</h3>
                        <p className="text-slate-400 mb-6">Create your first AI generated blog post based on your notes.</p>
                        <Link href="/dashboard/new" className="primary-btn inline-block">
                            Start Generating
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {blogs.map(blog => (
                            <div key={blog.id} className="glass-panel p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium text-slate-200">{blog.title}</h3>
                                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDistanceToNow(new Date(blog.date))} ago</span>
                                        <span className="flex items-center gap-1.5"><Eye size={14} /> {blog.views || 0} views</span>
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">{blog.category}</span>
                                    </div>
                                </div>
                                <Link href={`/blog/${user.username}/${blog.slug}`} target="_blank" className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-slate-300">
                                    <ExternalLink size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
