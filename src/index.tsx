import React from 'react';
import ChevronRightIcon from '../assets/chevron-right.svg';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

export interface PagingProps {
    current: number;
    onPageSelected: (page: number) => void;
    total: number;
    limit?: number;
    onNextPressed?: () => void;
    onPrevPressed?: () => void;
    containerStyle?: ViewStyle;
    itemStyle?: ViewStyle;
    labelStyle?: TextStyle;
    activeColor?: string;
    mainColor?: string;
}

const createStyles = () =>
    StyleSheet.create({
        dotsContainer: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        dotContainer: {
            borderWidth: 1,
            width: 30,
            height: 30,
            borderRadius: 15,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            alignSelf: 'center',
            marginHorizontal: 5,
            borderColor: 'transparent',
        },
        dotLabel: {
            color: 'white'
        },
        chevronContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

export const PagingComponent: React.FC<PagingProps> = ({ limit, total, onPageSelected, current, onNextPressed, onPrevPressed, containerStyle, itemStyle, labelStyle, activeColor = 'red', mainColor = 'white' }: PagingProps): React.ReactElement | null => {
    const styles = createStyles();
    let totalNumberOfPages: number = total;

    const moveToPage = (num: number) => {
        onPageSelected(num);
    };

    // If limit is provided, total become the total number of items instead of pages.
    if (limit) {
        totalNumberOfPages = Math.ceil(total / limit);
    }

    const onNext = () => {
        current + 1 === totalNumberOfPages ? onPageSelected(totalNumberOfPages - 1) : onPageSelected(current + 1);
        if (onNextPressed) { onNextPressed(); }
    };

    const onPrev = () => {
        current - 1 === -1 ? onPageSelected(0) : onPageSelected(current - 1);
        if (onPrevPressed) { onPrevPressed(); }
    };

    const RenderDot = (num: number) => {
        const containerBorderColor = num === current ? activeColor : 'transparent';
        return (
            <TouchableOpacity onPress={() => onPageSelected(num)}>
                <View style={[styles.dotContainer, { borderColor: containerBorderColor }, itemStyle]}>
                    <Text style={[styles.dotLabel, { color: num === current ? activeColor : mainColor }, labelStyle]}>{num + 1}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const RenderSeparator = (onPress: () => void) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.dotContainer]}>
                    <Text style={[styles.dotLabel, { color: mainColor }, labelStyle]}>. . .</Text>
                </View>
            </TouchableOpacity>
        );
    };


    const renderDotNumbers = () => {
        let dots = [];
        // All Numbered Dots count can fit in the screen.
        if (totalNumberOfPages <= 6) {
            for (let i = 0; i < totalNumberOfPages; i++) {
                dots.push(RenderDot(i));
            }
        }
        // Show first or last 3 numbers are selected.
        else if (current < 3 || current >= totalNumberOfPages - 3) {
            for (let i = 0; i < 3; i++) {
                dots.push(RenderDot(i));
            }
            dots.push(RenderSeparator(current < 3 ? onNext : onPrev));
            for (let i = 0; i < 3; i++) {
                dots.push(RenderDot(totalNumberOfPages - (3 - i)));
            }
        } else {
            dots.push(RenderSeparator(() => moveToPage(0)));
            [current - 2, current - 1, current, current + 1, current + 2].forEach((i) => dots.push(RenderDot(i)));
            dots.push(RenderSeparator(() => moveToPage(totalNumberOfPages - 1)));
        }
        return dots;
    };

    if (totalNumberOfPages === 0) {
        return null;
    }

    return (
        <View style={[styles.dotsContainer, containerStyle]}>
            <TouchableOpacity onPress={onPrev} style={[styles.chevronContainer]}>
                <ChevronRightIcon style={[{ transform: [{ scaleX: -1 }] }]} stroke={mainColor} />
            </TouchableOpacity>
            {renderDotNumbers()}
            <TouchableOpacity onPress={onNext} style={[styles.chevronContainer]}>
                <ChevronRightIcon stroke={mainColor} />
            </TouchableOpacity>
        </View>
    );
}
