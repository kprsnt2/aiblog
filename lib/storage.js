import { kv } from '@vercel/kv';

export async function getUsers() {
    const users = await kv.get('users');
    return users || [];
}

export async function saveUser(user) {
    const users = await getUsers();
    users.push(user);
    await kv.set('users', users);
}

export async function getUserByUsername(username) {
    const users = await getUsers();
    return users.find(u => u.username === username);
}

export async function getBlogs(username) {
    const blogs = await kv.get(`blogs:${username}`);
    return (blogs || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveBlog(username, blogData) {
    const blogs = await kv.get(`blogs:${username}`) || [];

    // Update if exists, otherwise push
    const existingIdx = blogs.findIndex(b => b.slug === blogData.slug);
    if (existingIdx >= 0) {
        blogs[existingIdx] = blogData;
    } else {
        blogs.push(blogData);
    }

    await kv.set(`blogs:${username}`, blogs);
    return blogData;
}

export async function getBlog(username, slug) {
    const blogs = await getBlogs(username);
    return blogs.find(b => b.slug === slug) || null;
}
