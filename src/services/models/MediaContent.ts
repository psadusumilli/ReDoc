import { observable, action, computed } from 'mobx';

import { OpenAPIMediaType } from '../../types';
import { MediaTypeModel } from './MediaType';

import { OpenAPIParser } from '../OpenAPIParser';

/**
 * MediaContent model ready to be sued by React components
 * Contains multiple MediaTypes and keeps track of the currently active on
 */
export class MediaContentModel {
  mediaTypes: MediaTypeModel[];

  @observable activeMimeIdx = 0;

  /**
   * @param isRequestType needed to know if skipe RO/RW fields in objects
   */
  constructor(
    public parser: OpenAPIParser,
    info: { [mime: string]: OpenAPIMediaType },
    public isRequestType: boolean = false,
  ) {
    this.mediaTypes = Object.entries(info).map(([name, mime]) => {
      // reset deref cache just in case something is left there
      parser.resetVisited();
      return new MediaTypeModel(parser, name, isRequestType, mime);
    });
  }

  /**
   * Set active media type by index
   * @param idx media type index
   */
  @action
  activate(idx: number) {
    this.activeMimeIdx = idx;
  }

  @computed
  get active() {
    return this.mediaTypes[this.activeMimeIdx];
  }

  get hasSample(): boolean {
    return this.mediaTypes.filter(mime => !!mime.examples).length > 0;
  }
}