import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BLOGS_DIR = path.join(DATA_DIR, 'blogs');

// Initialize directories and files
async function initStorage() {
    try {
        await fs.mkdir(BLOGS_DIR, { recursive: true });
        try {
            await fs.access(USERS_FILE);
        } catch {
            await fs.writeFile(USERS_FILE, JSON.stringify([]), 'utf8');
        }
    } catch (error) {
        console.error('Storage init error:', error);
    }
}
initStorage();

export async function getUsers() {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

export async function saveUser(user) {
    const users = await getUsers();
    users.push(user);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function getUserByUsername(username) {
    const users = await getUsers();
    return users.find(u => u.username === username);
}

export async function getBlogs(username) {
    const userBlogDir = path.join(BLOGS_DIR, username);
    try {
        const files = await fs.readdir(userBlogDir);
        const blogs = await Promise.all(
            files
                .filter(f => f.endsWith('.json'))
                .map(async f => {
                    const content = await fs.readFile(path.join(userBlogDir, f), 'utf8');
                    return JSON.parse(content);
                })
        );
        // Sort by date descending
        return blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
        return [];
    }
}

export async function saveBlog(username, blogData) {
    const userBlogDir = path.join(BLOGS_DIR, username);
    await fs.mkdir(userBlogDir, { recursive: true });

    const filePath = path.join(userBlogDir, `${blogData.slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(blogData, null, 2), 'utf8');
    return blogData;
}

export async function getBlog(username, slug) {
    const filePath = path.join(BLOGS_DIR, username, `${slug}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}
