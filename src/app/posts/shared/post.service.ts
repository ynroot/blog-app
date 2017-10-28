import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore'
import { Post } from './post.model';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostService {

  readonly path = 'posts';

  constructor(private afs: AngularFirestore) { }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  add(data: Post): Promise<DocumentReference> {
    const timestamp = this.timestamp;
    return this.afs.collection(this.path).add({ ...data, timestamp });
  }

  delete(id: string) {
    return this.afs.collection(this.path).doc(id).delete();
  }

  getCollection$(): Observable<Post[]> {
    return this.afs.collection<Post>(this.path).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

}
