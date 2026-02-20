import './globals.css';

export const metadata = {
    title: 'AIBlog | Next-Gen AI Blogging Platform',
    description: 'Turn your notes into polished, engaging blog posts in seconds.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
