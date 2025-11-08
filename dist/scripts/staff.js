document.addEventListener('DOMContentLoaded', async function() {
    await loadStaff();
});

async function loadStaff() {
    const staffGrid = document.getElementById('staffGrid');
    showLoading(staffGrid, 'Loading team members...');

    try {
        const staff = await StaffService.getAllStaff();

        if (staff.length === 0) {
            staffGrid.innerHTML = '<div class="loading">No team members found.</div>';
            return;
        }

        staffGrid.innerHTML = '';
        staff.forEach((member, index) => {
            const card = createStaffCard(member);
            card.setAttribute('data-animate', '');
            card.setAttribute('data-delay', (index * 100).toString());
            staffGrid.appendChild(card);
        });

        // Re-initialize animations
        if (window.IntersectionObserver) {
            const observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -100px 0px'
            };

            const animateOnScroll = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                            entry.target.classList.remove('animate-out');
                        }, delay);
                    } else {
                        if (entry.target.classList.contains('animate-in')) {
                            entry.target.classList.add('animate-out');
                            entry.target.classList.remove('animate-in');
                        }
                    }
                });
            }, observerOptions);

            staffGrid.querySelectorAll('[data-animate]').forEach(el => {
                animateOnScroll.observe(el);
            });
        }
    } catch (error) {
        console.error('Error loading staff:', error);
        showError(staffGrid, 'Unable to load team members. Please try again later.');
    }
}

function createStaffCard(member) {
    const card = document.createElement('div');
    card.className = 'staff-card';

    const photoContent = member.photo_url
        ? `<img src="${member.photo_url}" alt="${member.name}">`
        : getInitials(member.name);

    card.innerHTML = `
        <div class="staff-photo">
            ${photoContent}
        </div>
        <div class="staff-info">
            <h3 class="staff-name">${member.name}</h3>
            <p class="staff-role">${member.role}</p>
            ${member.bio ? `<p class="staff-bio">${member.bio}</p>` : ''}
            <a href="mailto:${member.email}" class="staff-email">
                ✉️ ${member.email}
            </a>
        </div>
    `;

    return card;
}

function getInitials(name) {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
}
