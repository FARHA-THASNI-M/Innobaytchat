import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popover } from 'antd';
import React, { useMemo, useState } from 'react';

function GroupCheckbox({ optionList, setFilters, filters, icon, title, styles = {} }) {
    const [arrow, setArrow] = useState('Show');
    const [selectedList, setSelectedList] = useState([])

    const onChange = (e, value) => {
        if (e.target.checked) {
            //add
            setSelectedList([...selectedList, value])
        } else {
            //remmove
            setSelectedList([...selectedList.filter(item => item !== value)])
        }
    };


    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            setFilters(selectedList)
        }
    }

    return (
        <div style={styles}>

            <Popover placement="bottom" trigger="click" content={(<div>
                {
                    optionList && optionList.map((item, index) => (
                        <div key={index}>
                            <Checkbox onChange={e => onChange(e, item.key)}>{item.value}</Checkbox>
                        </div>
                    ))
                }
            </div>)} arrow={mergedArrow} onOpenChange={handleOpenChange}>
                <Button type={selectedList && selectedList.length ? 'link' : 'text'} icon={icon}>
                    {selectedList && selectedList.length ? <b>{title}</b> : title}
                </Button>
            </Popover>
        </div>
    )
}

export default GroupCheckbox
