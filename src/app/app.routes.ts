import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';



export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create',
    loadChildren: () => import('./posts/posts.routes').then(mod => mod.routes),
     canActivate: [AuthGuard]
  },
  // { path: 'edit/:postId', component: PostCreateComponent },
  { path: 'edit/:postId',
    loadComponent: () => import('./posts/post-create/post-create.component')
        .then(c => c.PostCreateComponent),
         canActivate: [AuthGuard]
       },
   { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];
