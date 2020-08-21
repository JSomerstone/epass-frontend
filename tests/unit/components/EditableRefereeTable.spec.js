import { mount } from "@vue/test-utils";
import localVue from "../localVue";
import { BTable }from 'buefy'
import EditableRefereeTable from "@/components/EditableRefereeTable";

describe("EditableRefereeTable", () => {

  let referees = [
    { id: "a", firstName: 'John', lastName: "Connor", games: 1, tenSeconds: 2 },
    { id: "b", firstName: 'Sarah', lastName: "Connor", games: 3, tenSeconds: 4 },
  ];

  it("Renders list of referees when non-editable", () => {
    const wrapper = mount(EditableRefereeTable, {
      localVue,
      propsData: {
        value: referees,
        editable: false,
        editableItem: "none",
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders correct referee as editable", () => {
    const wrapper = mount(EditableRefereeTable, {
      localVue,
      propsData: {
        value: referees,
        editable: true,
        editableItem: "b",
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders all referees as editable", () => {
    const wrapper = mount(EditableRefereeTable, {
      localVue,
      propsData: {
        value: referees,
        editable: true,
        editableItem: "all",
      }
    });
    expect(wrapper).toMatchSnapshot();
  });


  it("Is able to remove an item from it's list", async () => {
    const wrapper = mount(EditableRefereeTable, {
      localVue,
      propsData: {
        value: referees,
        editable: true,
        editableItem: "b",
      }
    });
    const button = wrapper.find('button.is-danger')
    await button.trigger('click')
    expect(wrapper).toMatchSnapshot();
  });
});