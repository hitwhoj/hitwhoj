/**
 * search传入的参数
 *
 */
export class SearchUser {
  constructor(
    public id: number,
    public username: string,
    public nickname: string,
    public role: string,
    public privilege: number,
    public bio: string,
    public premium: boolean,
    public avatar: string
  ) {}
}
