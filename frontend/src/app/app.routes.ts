import { Routes } from '@angular/router';
import { Goals } from './pages/goals/goals';

export const routes: Routes = [
    // 1. Se o link for vazio (localhost:4200), mostra logo o Goals
    { path: '', component: Goals },

    // 2. Se o link for localhost:4200/goals, também mostra o Goals
    { path: 'goals', component: Goals }
];