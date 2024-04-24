import { DndDirective } from './dnd.directive';

describe('DndDirective', () => {
  it('debería instanciarse', () => {
    const directive = new DndDirective();
    expect(directive).toBeTruthy();
  });
});
