import { BoardsService } from './boards.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => String, { nullable: true })
  async fetchBoards(): Promise<string> {
    // 레디스 연습!
    // return this.boardsService.findAll();

    //1. 캐시에서 조회하는 연습
    const mycache = await this.cacheManager.get('qqq');
    console.log(mycache);

    return '캐시에서 조회완료!';
  }

  @Mutation(() => String)
  async createBoard(
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args('contents') contents: string,
    @Args('input') createBoardInput: CreateBoardInput,
  ): Promise<string> {
    // return this.boardsService.create(createBoardInput);

    //1. 캐시에 등록하는 연습 ( 0은 영구저장...인줄 알았는데 버젼바뀌면서 아닌듯 )
    await this.cacheManager.set('qqq', createBoardInput, {
      ttl: 5000,
    });

    //2. 등록완료 메시지 전달
    return '캐시에 등록완료!';
  }
}
