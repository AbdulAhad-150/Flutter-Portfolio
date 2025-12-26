    // <!-- Complete JavaScript section to be added at the end of the file -->
// Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Email copy functionality
const copyEmailBtn = document.getElementById('copy-email-btn');
const emailText = document.getElementById('email-text');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = emailText.textContent;
        
        // Copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            // Modern approach
            navigator.clipboard.writeText(email).then(() => {
                showSuccessMessage('Email copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                fallbackCopyTextToClipboard(email);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(email);
        }
    });
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccessMessage('Email copied to clipboard!');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showSuccessMessage('Failed to copy email. Please copy manually: ' + text, 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show success message function
function showSuccessMessage(message, type = 'success') {
    // Remove existing message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.backgroundColor = type === 'error' ? '#ef4444' : '#10b981';
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    successMessage.innerHTML = `
        <i class="fas ${icon}"></i> ${message}
    `;
    
    document.body.appendChild(successMessage);
    
    // Remove message after animation
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 2800);
}
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const projectType = document.getElementById('project').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        // For now, we'll show a Flutter-themed alert
        const projectTypeText = projectType ? ` for a ${projectType} app` : '';
        alert(`🚀 Thanks ${name}! I'll get back to you soon about your Flutter project${projectTypeText}.`);
        
        // Reset form
        contactForm.reset();
    });
    
    // Load GitHub projects with Flutter focus
    async function loadGitHubProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        
        try {
            // Fetch repositories from GitHub API
            const response = await fetch('https://api.github.com/users/AbdulAhad-150/repos?sort=updated&per_page=9');
            const repos = await response.json();
            
            // Clear loading placeholder
            projectsGrid.innerHTML = '';
            
            // Filter and sort repositories - prioritize Flutter/Dart projects
            const flutterRepos = repos.filter(repo => 
                repo.name.toLowerCase().includes('flutter') || 
                repo.name.toLowerCase().includes('dart') ||
                repo.description?.toLowerCase().includes('flutter') ||
                repo.description?.toLowerCase().includes('dart') ||
                repo.language === 'Dart'
            );
            
            const otherRepos = repos.filter(repo => 
                !flutterRepos.includes(repo)
            );
            
            const allRepos = [...flutterRepos, ...otherRepos].slice(0, 6);
            
            // Create project cards for each repository
            allRepos.forEach(repo => {
                // Skip if repository is a fork
                if (repo.fork) return;
                
                // Determine if it's a Flutter project
                const isFlutter = repo.language === 'Dart' || 
                                 repo.name.toLowerCase().includes('flutter') ||
                                 repo.description?.toLowerCase().includes('flutter');
                
                // Determine tech tags based on repository
                const techTags = [];
                if (isFlutter) techTags.push('Flutter');
                if (repo.language) techTags.push(repo.language);
                if (techTags.length === 0) techTags.push('Multiple');
                
                // Colors for different project types
                const projectColors = {
                    'Flutter': ['#02569B', '#13B9FD'],
                    'Dart': ['#0175C2', '#00C4B3'],
                    'JavaScript': ['#F7DF1E', '#000000'],
                    'HTML': ['#E34C26', '#F06529'],
                    'CSS': ['#2965F1', '#CC6699'],
                    'Python': ['#3776AB', '#FFD43B'],
                    'Default': ['#02569B', '#13B9FD']
                };
                
                const colorKey = isFlutter ? 'Flutter' : (repo.language in projectColors ? repo.language : 'Default');
                const colors = projectColors[colorKey];
                
                // Create project card
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Icons for different project types
                const projectIcons = {
                    'Flutter': 'fab fa-flutter',
                    'Dart': 'fas fa-code',
                    'mobile': 'fas fa-mobile-alt',
                    'web': 'fas fa-globe',
                    'Default': 'fas fa-code-branch'
                };
                
                const icon = isFlutter ? projectIcons.Flutter : 
                            (repo.name.toLowerCase().includes('mobile') ? projectIcons.mobile :
                            (repo.name.toLowerCase().includes('web') ? projectIcons.web : 
                            projectIcons.Default));
                
                projectCard.innerHTML = `
                    <div class="project-header">
                        ${isFlutter ? '<div class="flutter-logo"><i class="fab fa-flutter"></i></div>' : ''}
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}); color: white; font-size: 3rem;">
                            <i class="${icon}"></i>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-description">${repo.description || 'A personal project showcasing my development skills.'}</p>
                        <div class="project-tech">
                            ${techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                            ${repo.stargazers_count > 0 ? `<span class="tech-tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="btn" style="padding: 10px 20px;">View Code</a>
                           <!-- Live Demo button temporarily disabled
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-outline" style="padding: 10px 20px;">Live Demo</a>` : ''}
            -->
                        </div>
                    </div>
                `;
                
                projectsGrid.appendChild(projectCard);
            });
            
            // If no repositories found
            if (projectsGrid.children.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <div class="flutter-logo">
                                <i class="fab fa-flutter"></i>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #02569B, #13B9FD); color: white; font-size: 3rem;">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3 class="project-title">Sample Flutter Projects</h3>
                            <p class="project-description">Here are some examples of Flutter projects I can build:</p>
                            <div class="project-tech">
                                <span class="tech-tag">Flutter</span>
                                <span class="tech-tag">Firebase</span>
                                <span class="tech-tag">BLoC</span>
                            </div>
                            <div class="project-links">
                                <a href="https://github.com/AbdulAhad-150" target="_blank" class="btn" style="padding: 10px 20px;">Visit My GitHub</a>
                            </div>
                        </div>
                    </div>
                    <div class="project-card">
                        <div class="project-header">
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; font-size: 3rem;">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3 class="project-title">E-Commerce App</h3>
                            <p class="project-description">Full-featured shopping app with cart, payments, and user profiles.</p>
                            <div class="project-tech">
                                <span class="tech-tag">Flutter</span>
                                <span class="tech-tag">Firebase</span>
                                <span class="tech-tag">Stripe</span>
                            </div>
                            <div class="project-links">
                                <a href="#contact" class="btn" style="padding: 10px 20px;">Request Demo</a>
                            </div>
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error loading GitHub projects:', error);
            projectsGrid.innerHTML = `
                <div class="project-card">
                    <div class="project-header">
                        <div class="flutter-logo">
                            <i class="fab fa-flutter"></i>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #02569B, #13B9FD); color: white; font-size: 3rem;">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3 class="project-title">Connect to GitHub</h3>
                        <p class="project-description">Unable to fetch projects from GitHub. Please check your connection or visit my GitHub directly.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Flutter</span>
                            <span class="tech-tag">Portfolio</span>
                        </div>
                        <div class="project-links">
                            <a href="https://github.com/AbdulAhad-150" target="_blank" class="btn" style="padding: 10px 20px;">Visit GitHub</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Load projects when page loads
    document.addEventListener('DOMContentLoaded', loadGitHubProjects);
    
    // Add Flutter icon CSS
    document.addEventListener('DOMContentLoaded', function() {
        // Create a style element for the Flutter icon
        const style = document.createElement('style');
        style.textContent = `
            .fa-flutter:before {
                content: "\\f3e8";
                font-family: "Font Awesome 5 Brands";
            }
        `;
        document.head.appendChild(style);
    });