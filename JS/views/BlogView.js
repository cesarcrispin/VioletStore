/* ==========================================
   BLOG VIEW
   Vista del blog
   ========================================== */

import { BaseView } from './BaseView.js';

export class BlogView extends BaseView {
    constructor() {
        super('blogView');
        this.blogGrid = document.getElementById('blogGrid');
    }

    /**
     * Renderiza los posts del blog
     * @param {Array} posts 
     */
    render(posts) {
        if (!this.blogGrid) return;

        if (posts.length === 0) {
            this.blogGrid.innerHTML = '<p class="text-secondary">No hay publicaciones disponibles</p>';
            return;
        }

        this.blogGrid.innerHTML = posts.map(post => `
            <div class="blog-card">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                ${post.author ? `
                    <div class="blog-card-meta">
                        <span class="blog-card-author">${post.author}</span>
                        <span class="blog-card-date">${post.date}</span>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
}