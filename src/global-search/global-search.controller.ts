import { Body, Controller, Get, Post } from '@nestjs/common';
import { SearchDto } from './dto/search-dto';
import { GlobalSearchService } from './global-search.service';

@Controller('global-search')
export class GlobalSearchController {
  constructor(private globalSearchService: GlobalSearchService) {}

  @Post()
  getAllGlobalServices(@Body() searchDto: SearchDto) {
    return this.globalSearchService.globalSearch(searchDto);
  }
}
