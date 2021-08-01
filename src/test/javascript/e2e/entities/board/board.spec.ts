import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BoardComponentsPage, BoardDeleteDialog, BoardUpdatePage } from './board.page-object';

const expect = chai.expect;

describe('Board e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let boardComponentsPage: BoardComponentsPage;
  let boardUpdatePage: BoardUpdatePage;
  let boardDeleteDialog: BoardDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Boards', async () => {
    await navBarPage.goToEntity('board');
    boardComponentsPage = new BoardComponentsPage();
    await browser.wait(ec.visibilityOf(boardComponentsPage.title), 5000);
    expect(await boardComponentsPage.getTitle()).to.eq('Boards');
    await browser.wait(ec.or(ec.visibilityOf(boardComponentsPage.entities), ec.visibilityOf(boardComponentsPage.noResult)), 1000);
  });

  it('should load create Board page', async () => {
    await boardComponentsPage.clickOnCreateButton();
    boardUpdatePage = new BoardUpdatePage();
    expect(await boardUpdatePage.getPageTitle()).to.eq('Create or edit a Board');
    await boardUpdatePage.cancel();
  });

  it('should create and save Boards', async () => {
    const nbButtonsBeforeCreate = await boardComponentsPage.countDeleteButtons();

    await boardComponentsPage.clickOnCreateButton();

    await promise.all([boardUpdatePage.setBoardInput('board')]);

    await boardUpdatePage.save();
    expect(await boardUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await boardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Board', async () => {
    const nbButtonsBeforeDelete = await boardComponentsPage.countDeleteButtons();
    await boardComponentsPage.clickOnLastDeleteButton();

    boardDeleteDialog = new BoardDeleteDialog();
    expect(await boardDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Board?');
    await boardDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(boardComponentsPage.title), 5000);

    expect(await boardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
