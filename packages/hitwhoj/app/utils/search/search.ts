/**
 * search传入的参数
 *
 */ import {boolean, number, string} from "zod";

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
export const SearchUserDto ={
    id: number,
    username: string,
    nickname: string,
    role: string,
    privilege: number,
    bio: string,
    premium: boolean,
    avatar: string
}
