import { Route } from '@angular/router';
import { layoutGuard } from './layout/layout.guard';

export const appRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    { 
        path: '',
        canActivate: [layoutGuard],
        loadComponent: () => import('./layout/layout.component').then(x => x.LayoutComponent),
        children: [
            { path: 'projects', loadComponent: () => import('./pages/project-list-page/project-list-page.component').then(x => x.ProjectListPageComponent) },
            { path: 'pm2', loadComponent: () => import('./pages/pm2-dashboard-page/pm2-dashboard-page.component').then(x => x.Pm2DashboardPageComponent) },
            { path: 'docker', loadComponent: () => import('./pages/docker-dashboard-page/docker-dashboard-page.component').then(x => x.DockerDashboardPageComponent) },
            { path: 'profile', loadComponent: () => import('./pages/profile-page/profile-page.component').then(x => x.ProfilePageComponent) }
        ]
    }
];
