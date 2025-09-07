import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';


export const routes: Routes = [
  { path: '', component: PostListComponent },

  { path: 'create',
    loadChildren: () => import('./posts/posts.routes').then(mod => mod.routes)

  },
  // { path: 'edit/:postId', component: PostCreateComponent },
  { path: 'edit/:postId', loadComponent: () => import('./posts/post-create/post-create.component')
        .then(c => c.PostCreateComponent)  },
];
