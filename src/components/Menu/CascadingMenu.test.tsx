import React from 'react';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MatchMediaMock from 'jest-matchmedia-mock';
import { MenuItemIconAlign, MenuItemType } from './MenuItem/MenuItem.types';
import { MenuVariant } from './Menu.types';
import { CascadingMenu } from './CascadingMenu';
import { DefaultButton } from '../Button';
import { IconName } from '../Icon';
import { render, screen, waitFor } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

let matchMedia: any;

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;

const cascadingMenuItems = [
  {
    iconProps: {
      path: IconName.mdiCalendar,
    },
    text: 'Button',
    value: 'menu 1',
    counter: '8',
    secondaryButtonProps: {
      iconProps: {
        path: IconName.mdiTrashCan,
      },
    },
  },
  {
    text: 'Disabled button',
    value: 'menu 2',
    disabled: true,
    subText: 'This is a sub text',
  },
  {
    iconProps: {
      path: IconName.mdiCalendar,
    },
    text: 'Date',
    value: 'menu 3',
    counter: '8',
  },
  {
    alignIcon: MenuItemIconAlign.Right,
    iconProps: {
      path: IconName.mdiChevronRight,
    },
    dropdownMenuItems: [
      {
        text: 'Button 1',
        value: 'subMenuA 1',
      },
      {
        text: 'Button 2',
        value: 'subMenuA 1',
      },
      {
        text: 'Button 3',
        value: 'subMenuA 1',
      },
      {
        alignIcon: MenuItemIconAlign.Right,
        iconProps: {
          path: IconName.mdiChevronRight,
        },
        dropdownMenuItems: [
          {
            text: 'Button 4',
            value: 'subMenuB 1',
          },
          {
            text: 'Button 5',
            value: 'subMenuB 2',
          },
          {
            text: 'Button 6',
            value: 'subMenuB 3',
          },
        ],
        text: 'Sub menu 2',
        value: 'subMenuA 2',
      },
    ],
    text: 'Sub menu 1',
    value: 'menu 4',
  },
  {
    type: MenuItemType.subHeader,
    text: 'Sub header',
  },
  {
    type: MenuItemType.link,
    text: 'Twitter link',
    href: 'https://twitter.com',
    target: '_blank',
  },
];

const menuProps: Object = {
  variant: MenuVariant.neutral,
  classNames: 'my-menu-class',
  style: {
    color: 'red',
  },
  itemClassNames: 'my-menu-item-class',
  itemStyle: {},
  listType: 'ul',
};

const CascadingMenuComponent = (): JSX.Element => (
  <CascadingMenu {...menuProps} items={cascadingMenuItems}>
    <DefaultButton text={'Cascading menu'} />
  </CascadingMenu>
);

describe('Menu', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  test('Should render a menu button', () => {
    const { container } = render(<CascadingMenuComponent />);
    const dropdownButton = screen.getByRole('button');
    expect(dropdownButton).toBeTruthy();
    expect(() => container).not.toThrowError();
    expect(container).toMatchSnapshot();
  });

  test('Should show the menu items when the button is clicked', async () => {
    render(<CascadingMenuComponent />);
    const dropdownButton = screen.getByRole('button');
    dropdownButton.click();
    await waitFor(() => screen.getByText('Button'));
    const menuitem1 = screen.getByText('Button');
    const menuitem2 = screen.getByText('Disabled button');
    const menuitem3 = screen.getByText('Date');
    const menuitem4 = screen.getByText('Sub menu 1');
    const menuitem5 = screen.getByText('Twitter link');
    expect(menuitem1).toBeTruthy();
    expect(menuitem2).toBeTruthy();
    expect(menuitem3).toBeTruthy();
    expect(menuitem4).toBeTruthy();
    expect(menuitem5).toBeTruthy();
  });

  test('Should show the sub menu items when the button is clicked', async () => {
    render(<CascadingMenuComponent />);
    const dropdownButton = screen.getByRole('button');
    dropdownButton.click();
    await waitFor(() => screen.getByText('Sub menu 1'));
    const submenuitem = screen.getByText('Sub menu 1');
    submenuitem.click();
    await waitFor(() => screen.getByText('Button 1'));
    const menuitem1 = screen.getByText('Button 1');
    const menuitem2 = screen.getByText('Button 2');
    const menuitem3 = screen.getByText('Button 3');
    const menuitem4 = screen.getByText('Sub menu 2');
    expect(menuitem1).toBeTruthy();
    expect(menuitem2).toBeTruthy();
    expect(menuitem3).toBeTruthy();
    expect(menuitem4).toBeTruthy();
  });

  test('Should show the second sub menu items when the first sub menu button is clicked', async () => {
    render(<CascadingMenuComponent />);
    const dropdownButton = screen.getByRole('button');
    dropdownButton.click();
    await waitFor(() => screen.getByText('Sub menu 1'));
    const submenuitem1 = screen.getByText('Sub menu 1');
    submenuitem1.click();
    await waitFor(() => screen.getByText('Sub menu 2'));
    const submenuitem2 = screen.getByText('Sub menu 2');
    submenuitem2.click();
    await waitFor(() => screen.getByText('Button 4'));
    const menuitem1 = screen.getByText('Button 4');
    const menuitem2 = screen.getByText('Button 5');
    const menuitem3 = screen.getByText('Button 6');
    expect(menuitem1).toBeTruthy();
    expect(menuitem2).toBeTruthy();
    expect(menuitem3).toBeTruthy();
  });
});
