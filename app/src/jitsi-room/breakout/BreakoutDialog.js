import { useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

import { ButtonWithDialog } from "../general/ButtonWithDialog";


const BREAKOUT_OPTION_LABELS = ['By group size', 'By number of groups'];
const BREAKOUT_OPTIONS = ['bySize', 'byNumber'];
const NUMBER_LABEL = ['Group size', 'Number of groups'];

const SMART_BREAKOUT_OPTION_LABELS = ['Random', 'Same answers together', 'Different answers together'];
const SMART_BREAKOUT_OPTIONS = ['random', 'sameAnswers', 'differentAnswers'];



function BreakoutDialog(props) {

    const [breakoutRoomSize, setBreakoutRoomSize] = useState(5);
    const [breakoutOption, setBreakoutOption] = useState(0);
    const [smartBreakoutOption, setSmartBreakoutOption] = useState(0);

    return (
        <ButtonWithDialog
            headerText='Breakout Rooms'
            buttonText='Breakout Rooms'
            footer={<Button onClick={sendToBreakout}>Submit</Button>}>
            {renderContents()}
        </ButtonWithDialog>
    );



    function renderBreakoutOptions(labels, setOption, option) {

        const optionItems
            = labels.map((option, index) => (
                <Dropdown.Item
                    key={option}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={
                        () => {
                            setOption(index);
                        }
                    }>
                    { labels[index]}
                </Dropdown.Item>));
        return (
            <div>
                <DropdownButton title={labels[option]}>
                    {optionItems}
                </DropdownButton>
            </div>
        );
    }


    function renderContents() {
        return (
            <>
                <div>
                    <label>Options</label>
                    {renderBreakoutOptions(BREAKOUT_OPTION_LABELS, setBreakoutOption, breakoutOption)}

                    <label>{NUMBER_LABEL[breakoutOption]}</label>

                    <input min="1" max="20" name="quantity" value={breakoutRoomSize} type="number"
                        onChange={onBreakoutRoomSizeChange} />

                    <br></br>
                    <label> Smart breakout options </label>
                    {renderBreakoutOptions(SMART_BREAKOUT_OPTION_LABELS, setSmartBreakoutOption, smartBreakoutOption)}

                </div>
            </>



        )
    }

    function sendToBreakout() {
        props.sendToBreakout(breakoutRoomSize, BREAKOUT_OPTIONS[breakoutOption], SMART_BREAKOUT_OPTIONS[smartBreakoutOption]);
    }



    function onBreakoutRoomSizeChange(event) {
        setBreakoutRoomSize(event.target.value);
    }

}

export { BreakoutDialog };
