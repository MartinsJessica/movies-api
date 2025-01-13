Adicionar informações de como rodar as migrations no prisma
Como rodar o prisma studio


Alterar o user com a estratégia de `onDelete`

```
model Favorite {
  id      Int      @id @default(autoincrement())
  userId  Int
  movieId Int
  addedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  movie Movie @relation(fields: [movieId], references: [id])
}
```
movies-api
