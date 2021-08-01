import { element, by, ElementFinder } from 'protractor';

export class VillageComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-village div table .btn-danger'));
  title = element.all(by.css('jhi-village div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class VillageUpdatePage {
  pageTitle = element(by.id('jhi-village-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  boardInput = element(by.id('field_board'));
  villageInput = element(by.id('field_village'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setBoardInput(board: string): Promise<void> {
    await this.boardInput.sendKeys(board);
  }

  async getBoardInput(): Promise<string> {
    return await this.boardInput.getAttribute('value');
  }

  async setVillageInput(village: string): Promise<void> {
    await this.villageInput.sendKeys(village);
  }

  async getVillageInput(): Promise<string> {
    return await this.villageInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class VillageDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-village-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-village'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
