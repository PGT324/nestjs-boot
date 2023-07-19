import { Injectable, Scope } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';

@Injectable({ scope: Scope.DEFAULT }) // Default 는 싱글톤
export class BoardsService {
  findAll(): Board[] {
    const result: Board[] = [
      {
        number: 1,
        writer: '철수',
        title: '제목1',
        contents: '내용1',
      },
    ];

    return result;
  }

  create(createBoardInput: CreateBoardInput): string {
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);
    return '게시물 등록 성공';
  }
}
